import { PLAYER_BODY_BOUNDS, PLAYER_DEFAULT_TEXTURE_KEY, PLAYER_SPRITE_ANIMATIONS } from '../config/playerSpriteConfig';

const PLAYER_ANIMATION_KEYS = Object.fromEntries(
  PLAYER_SPRITE_ANIMATIONS.map((animation) => [animation.key, animation.animationKey]),
);

export class Player {
  constructor(scene, x, y, classType) {
    this.scene = scene;
    this.speed = 150;
    this.classType = classType;
    this.isMoving = false;
    this.isAttacking = false;
    this.currentAnimation = null;

    this.sprite = scene.physics.add.sprite(x, y, PLAYER_DEFAULT_TEXTURE_KEY);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);
    this.sprite.setScale(PLAYER_BODY_BOUNDS.scale);
    this.sprite.setData('entity', this);

    if (this.sprite.body) {
      this.sprite.body.setSize(PLAYER_BODY_BOUNDS.width, PLAYER_BODY_BOUNDS.height);
      this.sprite.body.setOffset(PLAYER_BODY_BOUNDS.offsetX, PLAYER_BODY_BOUNDS.offsetY);
    }

    this.nameText = scene.add.text(x, y - this.getLabelOffset(), '', {
      fontSize: '10px',
      color: '#ffd700',
      fontFamily: 'MedievalSharp, serif',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    this.playAnimation('idle');
  }

  update(cursors, wasd) {
    if (this.isAttacking) {
      this.sprite.setVelocity(0, 0);
      this.isMoving = false;
      this.updateLabelPosition();
      return;
    }

    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || wasd.A.isDown) vx = -1;
    if (cursors.right.isDown || wasd.D.isDown) vx = 1;
    if (cursors.up.isDown || wasd.W.isDown) vy = -1;
    if (cursors.down.isDown || wasd.S.isDown) vy = 1;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.sprite.setVelocity(vx * this.speed, vy * this.speed);
    this.isMoving = (vx !== 0 || vy !== 0);

    if (vx < 0) this.sprite.setFlipX(true);
    else if (vx > 0) this.sprite.setFlipX(false);

    this.syncAnimationState();
    this.updateLabelPosition();
  }

  attack() {
    if (this.isAttacking) return false;

    const attackAnimationKey = PLAYER_ANIMATION_KEYS.attack;
    if (!attackAnimationKey) return false;

    this.isAttacking = true;
    this.isMoving = false;
    this.sprite.setVelocity(0, 0);
    this.playAnimation('attack', true);

    this.sprite.once(`animationcomplete-${attackAnimationKey}`, () => {
      this.isAttacking = false;
      this.syncAnimationState();
    });

    return true;
  }

  syncAnimationState() {
    if (this.isAttacking) {
      this.playAnimation('attack', true);
      return;
    }

    this.playAnimation(this.isMoving ? 'walk' : 'idle');
  }

  playAnimation(stateKey, ignoreIfPlaying = false) {
    const animationKey = PLAYER_ANIMATION_KEYS[stateKey];
    if (!animationKey || this.currentAnimation === animationKey) return;

    this.currentAnimation = animationKey;
    this.sprite.anims.play(animationKey, ignoreIfPlaying);
  }

  updateLabelPosition() {
    this.nameText.setPosition(this.sprite.x, this.sprite.y - this.getLabelOffset());
  }

  getLabelOffset() {
    return Math.round((PLAYER_BODY_BOUNDS.height * PLAYER_BODY_BOUNDS.scale) + 12);
  }

  setName(name) {
    this.nameText.setText(name);
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y);
    this.updateLabelPosition();
  }

  destroy() {
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
