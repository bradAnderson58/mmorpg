import {Character} from "../intefaces/character.interface";
import {PlayerControls} from "../services/player.controls";
import * as img from "../assets/menu_background.jpg";
import * as target from "../assets/reticle.png";
import {ChatControls} from "../services/chat.controls";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'GameScene'
};

export class GameScene extends Phaser.Scene {
  private loading: Phaser.GameObjects.Text;
  private playerCharacter: Character;
  private playerControls: PlayerControls;
  private chatControls: ChatControls;

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

    this.playerControls = new PlayerControls(this, this.playerCharacter.template);
    this.chatControls = new ChatControls(this);
  }

  public update(): void {
    if (this.playerControls) {
      if (this.chatControls.notChatting()) {
        this.playerControls.movePlayer();
      } else {
        this.playerControls.pausePlayer();
      }
    }

  }
}