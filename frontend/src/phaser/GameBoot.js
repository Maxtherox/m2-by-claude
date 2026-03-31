import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { WorldScene } from './scenes/WorldScene';
import { UIOverlayScene } from './scenes/UIOverlayScene';

let gameInstance = null;

export function createGame(parentId, store) {
  if (gameInstance) gameInstance.destroy(true);
  window.__GAME_STORE__ = store;

  const config = {
    type: Phaser.AUTO,
    parent: parentId,
    width: 960,
    height: 540,
    pixelArt: true,
    backgroundColor: '#0a0a0f',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
      mouse: {
        preventDefaultWheel: true
      }
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [BootScene, WorldScene, UIOverlayScene]
  };

  gameInstance = new Phaser.Game(config);
  window.__PHASER_GAME__ = gameInstance;
  return gameInstance;
}

export function destroyGame() {
  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
    window.__GAME_STORE__ = null;
    window.__PHASER_GAME__ = null;
  }
}
