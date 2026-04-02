import Phaser from 'phaser';
import { setActiveMob } from '../../store/slices/uiSlice';
import { getEnemyDefinition } from '../config/enemySpriteConfig';

const SIZE_BY_MOB_TYPE = {
  normal: 44,
  aggressive: 48,
  elite: 56,
  boss: 72,
};

export class Mob {
  constructor(scene, x, y, mobData) {
    this.scene = scene;
    this.mobData = mobData;
    this.combatRange = 40;
    this.isPlayerNear = false;
    this.isAlive = true;
    this.currentAnimation = null;

    this.wanderTimer = 0;
    this.wanderInterval = Phaser.Math.Between(2000, 5000);
    this.homeX = x;
    this.homeY = y;
    this.wanderRadius = 60;
    this.wanderSpeed = 30;

    this.mobType = (mobData.mob_type || mobData.type || 'normal').toLowerCase();
    this.enemyDefinition = getEnemyDefinition(mobData.enemy_key) || null;
    const textureKey = this.enemyDefinition?.defaultTextureKey;

    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setImmovable(false);
    this.sprite.body.setAllowGravity(false);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(5);
    this.sprite.setData('entity', this);
    this.sprite.setData('entityType', 'mob');

    this.normalizeSpriteScale();
    this.syncAnimationState();

    const level = mobData.level || mobData.min_level || 1;
    const displayName = mobData.name || this.enemyDefinition?.name || 'Monstro';
    const labelColor = {
      normal: '#cccccc',
      aggressive: '#ff4444',
      elite: '#4488ff',
      boss: '#ffd700'
    };

    this.nameText = scene.add.text(x, y - this.getLabelOffset(), `${displayName} Lv.${level}`, {
      fontSize: '8px',
      color: labelColor[this.mobType] || '#cccccc',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    this.hpBarBg = scene.add.rectangle(x, y - this.getHpBarOffset(), 30, 3, 0x333333);
    this.hpBarBg.setDepth(20).setOrigin(0.5);

    this.hpBar = scene.add.rectangle(x, y - this.getHpBarOffset(), 30, 3, 0x00ff00);
    this.hpBar.setDepth(21).setOrigin(0.5);

    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', () => {
      this.triggerCombat();
    });
  }

  normalizeSpriteScale() {
    const baseTarget = SIZE_BY_MOB_TYPE[this.mobType] || 44;
    const width = Math.max(this.sprite.width || 1, 1);
    const height = Math.max(this.sprite.height || 1, 1);
    const scale = Math.min(baseTarget / width, baseTarget / height);

    this.sprite.setScale(scale);

    if (this.sprite.body) {
      const bodyWidth = Math.max(16, Math.round(this.sprite.displayWidth * 0.45));
      const bodyHeight = Math.max(16, Math.round(this.sprite.displayHeight * 0.55));
      this.sprite.body.setSize(bodyWidth, bodyHeight, true);
    }
  }

  getLabelOffset() {
    return Math.round((this.sprite.displayHeight / 2) + 16);
  }

  getHpBarOffset() {
    return Math.round((this.sprite.displayHeight / 2) + 8);
  }

  update(time, playerSprite) {
    if (!this.isAlive) return;

    this.nameText.setPosition(this.sprite.x, this.sprite.y - this.getLabelOffset());
    this.hpBarBg.setPosition(this.sprite.x, this.sprite.y - this.getHpBarOffset());
    this.hpBar.setPosition(this.sprite.x, this.sprite.y - this.getHpBarOffset());

    this.wanderTimer += time;
    if (this.wanderTimer >= this.wanderInterval) {
      this.wanderTimer = 0;
      this.wanderInterval = Phaser.Math.Between(2000, 5000);

      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(10, this.wanderRadius);
      const targetX = this.homeX + Math.cos(angle) * dist;
      const targetY = this.homeY + Math.sin(angle) * dist;

      const clampedX = Phaser.Math.Clamp(targetX, 20, 940);
      const clampedY = Phaser.Math.Clamp(targetY, 20, 620);

      const dx = clampedX - this.sprite.x;
      const dy = clampedY - this.sprite.y;
      const len = Math.sqrt(dx * dx + dy * dy);

      if (len > 0) {
        this.sprite.setVelocity(
          (dx / len) * this.wanderSpeed,
          (dy / len) * this.wanderSpeed
        );

        this.syncAnimationState();

        this.scene.time.delayedCall(Phaser.Math.Between(500, 1500), () => {
          if (this.sprite && this.sprite.body) {
            this.sprite.setVelocity(0, 0);
            this.syncAnimationState();
          }
        });
      }
    }

    this.syncFacingDirection();
    this.syncAnimationState();

    if (playerSprite) {
      const dist = Phaser.Math.Distance.Between(
        playerSprite.x, playerSprite.y,
        this.sprite.x, this.sprite.y
      );
      this.isPlayerNear = dist < this.combatRange;
    }
  }

  syncFacingDirection() {
    const velocityX = this.sprite.body?.velocity?.x || 0;

    if (Math.abs(velocityX) < 1) return;

    this.sprite.setFlipX(velocityX < 0);
  }

  syncAnimationState() {
    if (!this.enemyDefinition) return;

    const isMoving = Math.abs(this.sprite.body?.velocity?.x || 0) > 1 || Math.abs(this.sprite.body?.velocity?.y || 0) > 1;
    const state = isMoving && this.enemyDefinition.animations.move.length > 0 ? 'move' : 'idle';
    const animationKey = this.enemyDefinition.animationKeys[state];

    if (!animationKey || this.currentAnimation === animationKey) return;

    this.currentAnimation = animationKey;
    this.sprite.anims.play(animationKey, true);
  }

  triggerCombat() {
    if (!this.isAlive) return;

    const store = window.__GAME_STORE__;
    if (store) {
      store.dispatch(setActiveMob({
        id: this.mobData.id || Phaser.Math.Between(1, 9999),
        name: this.mobData.name || this.enemyDefinition?.name || 'Monstro',
        level: this.mobData.level || this.mobData.min_level || 1,
        type: this.mobData.mob_type || this.mobData.type || 'normal',
        hp: this.mobData.hp || 100,
        max_hp: this.mobData.max_hp || this.mobData.hp || 100,
        attack: this.mobData.attack || 10,
        defense: this.mobData.defense || 5,
        exp_reward: this.mobData.exp_reward || 20,
        gold_min: this.mobData.gold_min || this.mobData.gold_reward || 10,
        gold_max: this.mobData.gold_max || this.mobData.gold_reward || 10,
      }));
    }
  }

  setHpPercent(percent) {
    const width = Math.max(0, 30 * Math.min(1, percent));
    this.hpBar.setSize(width, 3);

    if (percent > 0.5) this.hpBar.setFillStyle(0x00ff00);
    else if (percent > 0.25) this.hpBar.setFillStyle(0xffff00);
    else this.hpBar.setFillStyle(0xff0000);
  }

  kill() {
    this.isAlive = false;
    this.sprite.setVisible(false);
    this.nameText.setVisible(false);
    this.hpBarBg.setVisible(false);
    this.hpBar.setVisible(false);
    this.sprite.body.enable = false;

    this.scene.time.delayedCall(15000, () => {
      this.respawn();
    });
  }

  respawn() {
    this.isAlive = true;
    this.sprite.setPosition(this.homeX, this.homeY);
    this.sprite.setVisible(true);
    this.nameText.setVisible(true);
    this.hpBarBg.setVisible(true);
    this.hpBar.setVisible(true);
    this.hpBar.setSize(30, 3);
    this.hpBar.setFillStyle(0x00ff00);
    this.sprite.body.enable = true;
    this.syncAnimationState();
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
    if (this.hpBarBg) this.hpBarBg.destroy();
    if (this.hpBar) this.hpBar.destroy();
  }
}
