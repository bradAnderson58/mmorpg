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
  }

  public create() {
    this.load.on('complete', (event) => this.realCreate(event));

    import(`../assets/${this.character.spriteSheet}.png`)
      .then(src => {
        this.load.spritesheet('player', src, {frameWidth: 78, frameHeight: 108});
        this.load.start();

        this.loading.destroy();
      });
  }

  public realCreate(event) {
    console.log(event);
    this.createSprite('player');
  }

  public createSprite(name: string, x: number = 200, y: number = 200) {
    const sprite = this.add.sprite(x, y, name)
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