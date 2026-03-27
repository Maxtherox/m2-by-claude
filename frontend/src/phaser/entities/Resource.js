import Phaser from 'phaser';
import * as api from '../../services/api';
import { loadCharacter } from '../../store/slices/characterSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { fetchLifeskills } from '../../store/slices/gameSlice';
import { addNotification } from '../../store/slices/uiSlice';

export class Resource {
  constructor(scene, x, y, resourceData) {
    this.scene = scene;
    this.resourceData = resourceData;
    this.interactionRange = 50;
    this.isPlayerNear = false;
    this.isDepleted = false;
    this.isGathering = false;
    this.respawnTime = 30000;

    const typeStr = (resourceData.type || resourceData.resource_type || 'mining').toLowerCase();
    const textureMap = {
      mining: 'resource_mining',
      woodcutting: 'resource_woodcutting',
      farming: 'resource_farming'
    };

    const textureKey = textureMap[typeStr] || 'resource_mining';

    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setImmovable(true);
    this.sprite.body.setAllowGravity(false);
    this.sprite.setDepth(4);
    this.sprite.setData('entity', this);
    this.sprite.setData('entityType', 'resource');

    const labelMap = {
      mining: 'Minério',
      woodcutting: 'Madeira',
      farming: 'Colheita'
    };

    const colorMap = {
      mining: '#aaaaaa',
      woodcutting: '#88cc44',
      farming: '#44cc44'
    };

    this.nameText = scene.add.text(x, y - 22, labelMap[typeStr] || 'Recurso', {
      fontSize: '8px',
      color: colorMap[typeStr] || '#aaaaaa',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    // Interaction prompt
    this.promptText = scene.add.text(x, y + 20, 'Pressione E', {
      fontSize: '8px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#00000088',
      padding: { x: 4, y: 2 },
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(25).setVisible(false);

    // Make interactive
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', () => {
      if (this.isPlayerNear && !this.isDepleted) {
        this.gather();
      }
    });

    // Store tweens for cleanup
    this._tweens = [];
    this._resourceType = typeStr;

    // Type-specific idle animations
    this._setupIdleAnimations(typeStr);
  }

  _setupIdleAnimations(typeStr) {
    if (typeStr === 'mining') {
      // Occasional sparkle effect
      this._sparkleTimer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => this._spawnSparkle(),
        loop: true
      });
    } else if (typeStr === 'woodcutting') {
      // Gentle sway animation
      this._swayTween = this.scene.tweens.add({
        targets: this.sprite,
        angle: 2,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this._tweens.push(this._swayTween);
    } else if (typeStr === 'farming') {
      // Gentle scale pulse (wind effect)
      this._windTween = this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1.03,
        scaleY: 1.02,
        duration: 1250,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this._tweens.push(this._windTween);
    }
  }

  _spawnSparkle() {
    if (this.isDepleted || !this.sprite || !this.sprite.active) return;
    const offsetX = Phaser.Math.Between(-8, 8);
    const offsetY = Phaser.Math.Between(-8, 8);
    const sparkle = this.scene.add.rectangle(
      this.sprite.x + offsetX,
      this.sprite.y + offsetY,
      2, 2, 0xffffff
    );
    sparkle.setDepth(this.sprite.depth + 1);
    sparkle.setAlpha(1);
    this.scene.tweens.add({
      targets: sparkle,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => sparkle.destroy()
    });
  }

  checkProximity(playerSprite) {
    if (this.isDepleted) {
      this.promptText.setVisible(false);
      return false;
    }

    const dist = Phaser.Math.Distance.Between(
      playerSprite.x, playerSprite.y,
      this.sprite.x, this.sprite.y
    );

    const wasNear = this.isPlayerNear;
    this.isPlayerNear = dist < this.interactionRange;

    if (this.isPlayerNear && !wasNear) {
      this.promptText.setVisible(true);
    } else if (!this.isPlayerNear && wasNear) {
      this.promptText.setVisible(false);
    }

    return this.isPlayerNear;
  }

  async gather() {
    if (this.isDepleted || !this.isPlayerNear || this.isGathering) return false;

    const store = window.__GAME_STORE__;
    const state = store?.getState();
    const charId = state?.character?.data?.id;
    const typeStr = (this.resourceData.type || this.resourceData.resource_type || 'mining').toLowerCase();

    if (!store || !charId) return false;

    this.isGathering = true;

    try {
      const result = await api.performLifeskill(charId, typeStr, this.resourceData.area_id);

      if (!result?.success) {
        store.dispatch(addNotification({ type: 'error', message: 'Nao foi possivel coletar este recurso agora.' }));
        return false;
      }

      const data = result.data || {};
      let message = `${this.resourceData.name || typeStr}: coleta concluida`;

      if (data.items_gathered?.length > 0) {
        message = data.items_gathered.map((item) => `${item.name} x${item.quantity}`).join(', ');
      }

      if (data.leveled_up) {
        message += ` | Level Up! Lv.${data.new_level}`;
      }

      store.dispatch(addNotification({ type: 'loot', message }));
      store.dispatch(loadCharacter(charId));
      store.dispatch(fetchInventory(charId));
      store.dispatch(fetchLifeskills(charId));
      this.deplete();
      return true;
    } catch (error) {
      store.dispatch(addNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erro ao coletar recurso',
      }));
      return false;
    } finally {
      this.isGathering = false;
    }
  }

  deplete() {
    this.isDepleted = true;
    this.promptText.setVisible(false);

    // Shake animation before going transparent
    const origX = this.sprite.x;
    this._shakeTween = this.scene.tweens.add({
      targets: this.sprite,
      x: origX + 3,
      duration: 50,
      yoyo: true,
      repeat: 5,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.sprite.setPosition(origX, this.sprite.y);
        this.sprite.setAlpha(0.3);
        this.nameText.setAlpha(0.3);
      }
    });
    this._tweens.push(this._shakeTween);

    // Respawn after delay
    this.scene.time.delayedCall(this.respawnTime, () => {
      this.replenish();
    });
  }

  replenish() {
    this.isDepleted = false;
    this.sprite.setAlpha(1);
    this.nameText.setAlpha(1);
  }

  destroy() {
    // Stop all tweens
    if (this._tweens) {
      this._tweens.forEach(t => { if (t && t.isPlaying) t.stop(); });
      this._tweens = [];
    }
    if (this._sparkleTimer) {
      this._sparkleTimer.remove(false);
      this._sparkleTimer = null;
    }
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
    if (this.promptText) this.promptText.destroy();
  }
}
