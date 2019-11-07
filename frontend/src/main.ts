
import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & {body: Phaser.Physics.Arcade.Body};

  constructor() {
    super(sceneConfig);
  }

  public create() {
    this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF) as any;
    this.physics.add.existing(this.square);
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();
    if (cursorKeys.up.isDown) {
      this.square.body.setVelocityY(-500);
    } else {
      this.square.body.setVelocityY(0);
    }
  }
}

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