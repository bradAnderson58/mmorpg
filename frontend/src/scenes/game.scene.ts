import {Character} from "../intefaces/character.interface";
import {PlayerControls} from "../services/player.controls";
import * as img from "../assets/menu_background.jpg";
import * as target from "../assets/reticle.png";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'GameScene'
};

export class GameScene extends Phaser.Scene {
  private loading: Phaser.GameObjects.Text;
  private playerCharacter: Character;
  private characterSprite: Phaser.GameObjects.Sprite;
  private playerControls: PlayerControls;

  constructor() {
    super(sceneConfig);
  }

  public init(playerCharacter: Character): void {
    this.playerCharacter = playerCharacter;
  }

  public preload(): void {
    this.loading = this.add.text(20, 20, 'Loading Game...');
  }

  public create() {
    this.load.on('complete', (event) => this.realCreate(event));

    import(`../assets/${this.playerCharacter.template.spriteSheet}.png`)
      .then(src => {
        this.load.spritesheet('player', src, {frameWidth: 78, frameHeight: 108});
        this.load.image('test', img);
        this.load.image('target', target);
        this.load.start();

        this.loading.destroy();
      });
  }

  public realCreate(event) {
    const background = this.add.image(0, 0, 'login-background')
      .setOrigin(0, 0)
      .setDisplaySize(window.innerWidth, window.innerHeight);

    this.characterSprite = this.createSprite('player');
    this.cameras.main.startFollow(this.characterSprite);
    this.playerControls = new PlayerControls(this, this.characterSprite);
  }

  public update(): void {
    if (this.playerControls) {
      this.playerControls.movePlayer();
    }
  }

  public createSprite(name: string, x: number = 200, y: number = 200): Phaser.GameObjects.Sprite {
    const sprite = this.add.sprite(x, y, name).setName(`${name}-sprite`);

    ['north', 'south', 'east', 'west'].forEach(direction => {
      this.anims.create({
        key: `${name}-${direction}`,
        frames: this.anims.generateFrameNumbers(name, this.playerCharacter.template.animations[direction]),
        frameRate: 6,
        repeat: -1
      })
    });

    sprite.anims.load(`${name}-south`);
    sprite.setFrame(1);
    return sprite;
  }
}