import * as Phaser from "phaser";
import * as img from "./assets/logo.png";
//const img = require('./assets/logo.png');

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MenuScreen',
};

export class GameScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & {body: Phaser.Physics.Arcade.Body};
  private loading: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Sprite;

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    this.loading = this.add.text(20, 20, "Loading Game...");
    this.load.image('background', img);
  }

  public create() {
    this.background = this.add.sprite(400, 300, 'background');
    console.log(this.background);
    this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF) as any;
    this.physics.add.existing(this.square);

    this.loading.destroy();
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