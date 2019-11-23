import {Character} from "../intefaces/character.interface";
import * as chara3 from "../assets/chara3.png";


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
    import(`../assets/${this.character.spriteSheet}.png`)
      .then(src => {
        this.load.spritesheet('player', src, {frameWidth: 78, frameHeight: 108});
      });

    console.log(chara3);
    this.load.spritesheet('test', chara3, {frameWidth: 78, frameHeight: 108});

    this.loading.destroy();
  }

  public create() {
    console.log('nothing');
    this.createSprite('test');
    this.createSprite('player', 400, 300);
  }

  public createSprite(name: string, x: number = 200, y: number = 200) {
    const sprite = this.add.sprite(x, y, name)
      //.setDisplaySize(0, 0)
      .setName(`${name}-sprite`);

    this.anims.create({
      key: `${name}-anim`,
      frames: this.anims.generateFrameNumbers(name, this.character.walkAnimation),
      frameRate: 6,
      repeat: -1
    });

    sprite.anims.load(`${name}-anim`);
    sprite.anims.play(`${name}-anim`);
  }
}