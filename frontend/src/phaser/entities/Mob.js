import Phaser from 'phaser';
import { setActiveMob } from '../../store/slices/uiSlice';

let _nextInstanceId = 1;

export class Mob {
  constructor(scene, x, y, mobData) {
    this.scene = scene;
    this.mobData = mobData;
    this.instanceId = _nextInstanceId++;
    this.combatRange = 40;
    this.isPlayerNear = false;
    this.isAlive = true;

    // Wandering AI state
    this.wanderTimer = 0;
    this.wanderInterval = Phaser.Math.Between(2000, 5000);
    this.homeX = x;
    this.homeY = y;
    this.wanderRadius = 60;
    this.wanderSpeed = 30;

    const mobType = (mobData.mob_type || mobData.type || 'normal').toLowerCase();
    const textureMap = {
      normal: 'mob_normal',
      aggressive: 'mob_aggressive',
      elite: 'mob_elite',
      boss: 'mob_boss'
    };

    const textureKey = textureMap[mobType] || 'mob_normal';
    this._animKey = textureKey;

    this.sprite = scene.physics.add.sprite(x, y, textureKey, 0);
    this.sprite.setImmovable(false);
    this.sprite.body.setAllowGravity(false);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(5);
    this.sprite.setData('entity', this);
    this.sprite.setData('entityType', 'mob');

    // Color tint by type
    const tintMap = {
      normal: 0xffffff,
      aggressive: 0xff8888,
      elite: 0x8888ff,
      boss: 0xffd700
    };
    this.sprite.setTint(tintMap[mobType] || 0xffffff);

    // Name + level label
    const level = mobData.level || mobData.min_level || 1;
    const displayName = mobData.name || 'Monstro';
    const labelColor = {
      normal: '#cccccc',
      aggressive: '#ff4444',
      elite: '#4488ff',
      boss: '#ffd700'
    };

    this.nameText = scene.add.text(x, y - 22, `${displayName} Lv.${level}`, {
      fontSize: '8px',
      color: labelColor[mobType] || '#cccccc',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    // HP bar background
    this.hpBarBg = scene.add.rectangle(x, y - 14, 30, 3, 0x333333);
    this.hpBarBg.setDepth(20).setOrigin(0.5);

    // HP bar fill
    this.hpBar = scene.add.rectangle(x, y - 14, 30, 3, 0x00ff00);
    this.hpBar.setDepth(21).setOrigin(0.5);

    // Make mob interactive (clickable)
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', () => {
      this.triggerCombat();
    });

    // Store tweens for cleanup
    this._tweens = [];
    this._isWandering = false;

    // Idle breathing animation (randomized timing per mob)
    this._breathDuration = Phaser.Math.Between(1200, 2000);
    this._startIdleBreathing();

    // Type-specific visual effects
    this._mobType = mobType;
    this._setupTypeEffects(mobType);
  }

  _startIdleBreathing() {
    this._stopIdleBreathing();
    this._idleTween = this.scene.tweens.add({
      targets: this.sprite,
      scaleY: 1.02,
      duration: this._breathDuration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this._tweens.push(this._idleTween);
  }

  _stopIdleBreathing() {
    if (this._idleTween) {
      this._idleTween.stop();
      this.sprite.setScale(1, 1);
      this._idleTween = null;
    }
  }

  _startWanderRotation() {
    this._stopWanderRotation();
    this._wanderRotTween = this.scene.tweens.add({
      targets: this.sprite,
      angle: 3,
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this._tweens.push(this._wanderRotTween);
  }

  _stopWanderRotation() {
    if (this._wanderRotTween) {
      this._wanderRotTween.stop();
      this.sprite.setAngle(0);
      this._wanderRotTween = null;
    }
  }

  _setupTypeEffects(mobType) {
    if (mobType === 'boss') {
      // Golden glow behind boss sprite
      this._glowSprite = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.sprite.texture.key);
      this._glowSprite.setTint(0xffd700);
      this._glowSprite.setAlpha(0.3);
      this._glowSprite.setScale(1.4);
      this._glowSprite.setDepth(this.sprite.depth - 1);
      this._glowPulseTween = this.scene.tweens.add({
        targets: this._glowSprite,
        alpha: 0.15,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this._tweens.push(this._glowPulseTween);
    } else if (mobType === 'elite') {
      // Blue glow behind elite sprite, more subtle
      this._glowSprite = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.sprite.texture.key);
      this._glowSprite.setTint(0x4488ff);
      this._glowSprite.setAlpha(0.2);
      this._glowSprite.setScale(1.25);
      this._glowSprite.setDepth(this.sprite.depth - 1);
      this._glowPulseTween = this.scene.tweens.add({
        targets: this._glowSprite,
        alpha: 0.1,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this._tweens.push(this._glowPulseTween);
    } else if (mobType === 'aggressive') {
      // Red eye glow: small red rectangle that flickers
      this._redEye = this.scene.add.rectangle(this.sprite.x, this.sprite.y - 6, 2, 2, 0xff0000);
      this._redEye.setDepth(this.sprite.depth + 1);
      this._redEyeTween = this.scene.tweens.add({
        targets: this._redEye,
        alpha: 0.2,
        duration: 150,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this._tweens.push(this._redEyeTween);
    }
  }

  update(time, playerSprite) {
    if (!this.isAlive) return;

    // Update label positions
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 22);
    this.hpBarBg.setPosition(this.sprite.x, this.sprite.y - 14);
    this.hpBar.setPosition(this.sprite.x, this.sprite.y - 14);

    // Wandering AI
    this.wanderTimer += time;
    if (this.wanderTimer >= this.wanderInterval) {
      this.wanderTimer = 0;
      this.wanderInterval = Phaser.Math.Between(2000, 5000);

      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(10, this.wanderRadius);
      const targetX = this.homeX + Math.cos(angle) * dist;
      const targetY = this.homeY + Math.sin(angle) * dist;

      // Clamp to world bounds
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

        // Flip based on direction
        if (dx < 0) this.sprite.setFlipX(true);
        else if (dx > 0) this.sprite.setFlipX(false);

        // Start wander rotation and walk animation
        if (!this._isWandering) {
          this._isWandering = true;
          this._startWanderRotation();
          const walkKey = `${this._animKey}_walk`;
          if (this.scene.anims.exists(walkKey)) {
            this.sprite.play(walkKey, true);
          }
        }

        // Stop after reaching destination
        this.scene.time.delayedCall(Phaser.Math.Between(500, 1500), () => {
          if (this.sprite && this.sprite.body) {
            this.sprite.setVelocity(0, 0);
            this._isWandering = false;
            this._stopWanderRotation();
            // Stop walk animation and show standing frame
            this.sprite.stop();
            this.sprite.setFrame(0);
          }
        });
      }
    }

    // Update glow/eye positions
    if (this._glowSprite) {
      this._glowSprite.setPosition(this.sprite.x, this.sprite.y);
      this._glowSprite.setFlipX(this.sprite.flipX);
    }
    if (this._redEye) {
      this._redEye.setPosition(this.sprite.x, this.sprite.y - 6);
    }

    // Check proximity to player
    if (playerSprite) {
      const dist = Phaser.Math.Distance.Between(
        playerSprite.x, playerSprite.y,
        this.sprite.x, this.sprite.y
      );
      this.isPlayerNear = dist < this.combatRange;
    }
  }

  triggerCombat() {
    if (!this.isAlive) return;

    const store = window.__GAME_STORE__;
    if (store) {
      store.dispatch(setActiveMob({
        id: this.mobData.id || Phaser.Math.Between(1, 9999),
        instanceId: this.instanceId,
        name: this.mobData.name || 'Monstro',
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
    if (this._glowSprite) this._glowSprite.setVisible(false);
    if (this._redEye) this._redEye.setVisible(false);

    // Respawn after delay
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
    if (this._glowSprite) {
      this._glowSprite.setPosition(this.homeX, this.homeY);
      this._glowSprite.setVisible(true);
    }
    if (this._redEye) {
      this._redEye.setPosition(this.homeX, this.homeY - 6);
      this._redEye.setVisible(true);
    }
    this._startIdleBreathing();
  }

  destroy() {
    // Stop all tweens
    if (this._tweens) {
      this._tweens.forEach(t => { if (t && t.isPlaying) t.stop(); });
      this._tweens = [];
    }
    this._stopIdleBreathing();
    this._stopWanderRotation();
    if (this._glowSprite) this._glowSprite.destroy();
    if (this._redEye) this._redEye.destroy();
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
    if (this.hpBarBg) this.hpBarBg.destroy();
    if (this.hpBar) this.hpBar.destroy();
  }
}
