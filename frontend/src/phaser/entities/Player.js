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

    this.sprite = scene.physics.add.sprite(x, y, textureKey);
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

    // Update name label position
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 30);
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
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
  }
}
