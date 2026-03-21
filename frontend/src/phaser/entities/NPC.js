import Phaser from 'phaser';
import { setActiveNpc } from '../../store/slices/uiSlice';
import { getNpcSpriteType, normalizeNpcType } from '../utils/worldState';

export class NPC {
  constructor(scene, x, y, npcData) {
    this.scene = scene;
    this.npcData = npcData;
    this.interactionRange = 60;
    this.isPlayerNear = false;

    const spriteType = getNpcSpriteType(npcData.type);
    const textureMap = {
      shop: 'npc_shop',
      blacksmith: 'npc_blacksmith',
      healer: 'npc_healer',
      trainer: 'npc_trainer',
      material: 'npc_material',
      lifeskill: 'npc_lifeskill',
      storage: 'npc_storage'
    };

    const textureKey = textureMap[spriteType] || 'npc_shop';

    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setImmovable(true);
    this.sprite.body.setAllowGravity(false);
    this.sprite.setDepth(5);
    this.sprite.setData('entity', this);
    this.sprite.setData('entityType', 'npc');

    // Name label
    this.nameText = scene.add.text(x, y - 34, npcData.name || 'NPC', {
      fontSize: '9px',
      color: '#00ff00',
      fontFamily: 'MedievalSharp, serif',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    // Exclamation mark indicator
    this.indicatorIcon = scene.add.sprite(x, y - 48, 'interact_icon');
    this.indicatorIcon.setDepth(20);
    this.indicatorIcon.setOrigin(0.5);

    // Floating animation on the indicator
    scene.tweens.add({
      targets: this.indicatorIcon,
      y: y - 54,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Interaction prompt (hidden by default)
    this.promptText = scene.add.text(x, y + 32, 'Pressione E', {
      fontSize: '8px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#00000088',
      padding: { x: 4, y: 2 },
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(25).setVisible(false);

    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', () => {
      if (this.isPlayerNear) {
        this.interact();
      }
    });
  }

  checkProximity(playerSprite) {
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

  interact() {
    if (!this.isPlayerNear) return false;

    const store = window.__GAME_STORE__;
    if (store) {
      store.dispatch(setActiveNpc({
        id: this.npcData.id || this.npcData.type,
        type: normalizeNpcType(this.npcData.type),
        name: this.npcData.name,
        description: this.npcData.description,
        dialog: this.npcData.dialog,
      }));
    }
    return true;
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
    if (this.indicatorIcon) this.indicatorIcon.destroy();
    if (this.promptText) this.promptText.destroy();
  }
}
