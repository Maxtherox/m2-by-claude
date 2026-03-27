export class Player {
  constructor(scene, x, y, classType) {
    this.scene = scene;

    const textureMap = {
      1: 'player_warrior',
      2: 'player_ninja',
      3: 'player_sura',
      4: 'player_shaman'
    };

    const textureKey = textureMap[classType] || 'player_warrior';
    this._animKey = textureKey;

    this.sprite = scene.physics.add.sprite(x, y, textureKey, 0);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);
    this.sprite.setData('entity', this);

    this.nameText = scene.add.text(x, y - 30, '', {
      fontSize: '10px',
      color: '#ffd700',
      fontFamily: 'MedievalSharp, serif',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    this.speed = 150;
    this.classType = classType;
    this.isMoving = false;
    this._wasMoving = false;

    // Shadow under player
    this.shadow = scene.add.ellipse(x, y + 12, 20, 8, 0x000000, 0.3);
    this.shadow.setDepth(9);

    // Store tweens for cleanup
    this._tweens = [];

    // Start idle breathing animation
    this._startIdleBreathing();
  }

  _startIdleBreathing() {
    this._stopIdleBreathing();
    this._idleTween = this.scene.tweens.add({
      targets: this.sprite,
      scaleY: 1.02,
      duration: 1500,
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

  _startWalkingBob() {
    // Walking bob now handled by spritesheet animation only
  }

  _stopWalkingBob() {
    // No-op
  }

  update(cursors, wasd) {
    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || wasd.A.isDown) vx = -1;
    if (cursors.right.isDown || wasd.D.isDown) vx = 1;
    if (cursors.up.isDown || wasd.W.isDown) vy = -1;
    if (cursors.down.isDown || wasd.S.isDown) vy = 1;

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.sprite.setVelocity(vx * this.speed, vy * this.speed);
    this.isMoving = (vx !== 0 || vy !== 0);

    // Flip sprite based on direction
    if (vx < 0) this.sprite.setFlipX(true);
    else if (vx > 0) this.sprite.setFlipX(false);

    // Track movement state changes for animations
    if (this.isMoving && !this._wasMoving) {
      this._stopIdleBreathing();
      this._startWalkingBob();
      // Play walk sprite animation
      const walkKey = `${this._animKey}_walk`;
      if (this.scene.anims.exists(walkKey)) {
        this.sprite.play(walkKey, true);
      }
    } else if (!this.isMoving && this._wasMoving) {
      this._stopWalkingBob();
      this._startIdleBreathing();
      // Stop walk sprite animation and show standing frame
      this.sprite.stop();
      this.sprite.setFrame(0);
    }
    this._wasMoving = this.isMoving;

    // Update name label and shadow position
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 30);
    if (this.shadow) {
      this.shadow.setPosition(this.sprite.x, this.sprite.y + 12);
    }
  }

  setName(name) {
    this.nameText.setText(name);
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y);
    this.nameText.setPosition(x, y - 30);
  }

  destroy() {
    // Stop all tweens
    this._stopIdleBreathing();
    this._stopWalkingBob();
    if (this._tweens) {
      this._tweens.forEach(t => { if (t && t.isPlaying) t.stop(); });
      this._tweens = [];
    }
    if (this.shadow) this.shadow.destroy();
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
