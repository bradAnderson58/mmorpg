
import * as Phaser from 'phaser';
import {GameScene} from "./menu.scene";


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'MORPG',
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },

  parent: 'game',
  backgroundColor: '#000000',

  scene: GameScene,
};

export const game = new Phaser.Game(gameConfig);