import './styles/style.css';

import * as Phaser from 'phaser';
import {LoginScene} from "./scenes/login.scene";
import {MenuScene} from "./scenes/menu.scene";
import {GameScene} from "./scenes/game.scene";


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
  dom: {
    createContainer: true
  },
  backgroundColor: '#000000',

  scene: [LoginScene, MenuScene, GameScene],
};

export const game = new Phaser.Game(gameConfig);