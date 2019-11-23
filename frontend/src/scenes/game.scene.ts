import {Character} from "../intefaces/character.interface";


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'GameScene'
};

export class GameScene extends Phaser.Scene {
  private loading: Phaser.GameObjects.Text;
  private character: Character;

  constructor() {
    super(sceneConfig);
  }

  public init(initParams: any): void {
    this.character = initParams.character;
  }

  public preload(): void {
    this.loading = this.add.text(20, 20, 'Loading Game...');
    //this.load.spritesheet('player', this.character.spriteSheet, this.character.walkAnimation);

  }

  public create() {
    /*const sprite = this.add.sprite(0, 0, this.character.spriteSheet)
      .setDisplaySize(0, 0)
      .setName('display-sprite');

    this.anims.create({
      key: 'display-anim',
      frames: this.anims.generateFrameNumbers(this.character.spriteSheet, this.character.walkAnimation),
      frameRate: 6,
      repeat: -1
    });

    sprite.anims.load('display-anim');
    sprite.anims.play('display-anim');*/
  }
}