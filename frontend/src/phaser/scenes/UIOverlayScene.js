import Phaser from 'phaser';

export class UIOverlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIOverlayScene' });
  }

  create() {
    // Area name display (top center)
    this.areaNameText = this.add.text(480, 40, '', {
      fontSize: '20px',
      color: '#ffd700',
      fontFamily: 'MedievalSharp, serif',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5).setDepth(100).setAlpha(0).setScrollFactor(0);

    // Coordinate display (bottom-right)
    this.coordText = this.add.text(940, 520, 'X: 0  Y: 0', {
      fontSize: '10px',
      color: '#aaaaaa',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(1, 1).setDepth(100).setScrollFactor(0);

    this.controlsText = this.add.text(20, 520, [
      'WASD/Setas mover | E interagir | Espaco atacar',
      'I inventario | O equipamento | K skills | P profissoes | ESC menu'
    ].join('\n'), {
      fontSize: '10px',
      color: '#d7c49a',
      fontFamily: 'MedievalSharp, serif',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#00000055',
      padding: { x: 8, y: 5 }
    }).setOrigin(0, 1).setDepth(100).setScrollFactor(0);

    // Interaction prompt (reusable, hidden by default)
    this.interactionPrompt = this.add.text(0, 0, 'Pressione E', {
      fontSize: '10px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 },
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(100).setVisible(false).setScrollFactor(0);

    // Pool for floating texts
    this.floatingTexts = [];

    // Listen for events from WorldScene
    const worldScene = this.scene.get('WorldScene');
    if (worldScene) {
      worldScene.events.on('show-area-name', this.showAreaName, this);
      worldScene.events.on('show-floating-text', this.handleFloatingText, this);
      worldScene.events.on('show-interaction-prompt', this.showInteractionPrompt, this);
      worldScene.events.on('hide-interaction-prompt', this.hideInteractionPrompt, this);
      worldScene.events.on('update-coords', this.updateCoords, this);
    }
  }

  showAreaName(name) {
    this.areaNameText.setText(name);
    this.areaNameText.setAlpha(1);

    // Fade in
    this.tweens.add({
      targets: this.areaNameText,
      alpha: 1,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        // Hold for 2 seconds then fade out
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: this.areaNameText,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
          });
        });
      }
    });
  }

  handleFloatingText(data) {
    this.showFloatingText(data.x, data.y, data.text, data.color);
  }

  showFloatingText(x, y, text, color) {
    const floatText = this.add.text(x, y, text, {
      fontSize: '12px',
      color: color || '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(110);

    this.tweens.add({
      targets: floatText,
      y: y - 50,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        floatText.destroy();
      }
    });
  }

  showInteractionPrompt(x, y) {
    this.interactionPrompt.setPosition(x, y);
    this.interactionPrompt.setVisible(true);
  }

  hideInteractionPrompt() {
    this.interactionPrompt.setVisible(false);
  }

  updateCoords(coords) {
    this.coordText.setText(`X: ${Math.round(coords.x)}  Y: ${Math.round(coords.y)}`);
  }

  update() {
    // Cleanup is handled by tweens automatically
  }
}
