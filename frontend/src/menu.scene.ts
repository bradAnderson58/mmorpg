import * as Phaser from "phaser";
import './styles/style.css';
import * as img from "./assets/menu_background.jpg";
import * as font from "./assets/ancient_modern.png";
import {TextButton} from "./game-objects/text-button";
import {MenuContainer} from "./game-objects/menu-container";


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MenuScreen',
};

export class GameScene extends Phaser.Scene {
  private menuContainer: Phaser.GameObjects.Container;
  private loading: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Image;
  private loginButton: Phaser.GameObjects.Text;
  private createAccountButton: Phaser.GameObjects.Text;
  private midX: number;
  private midY: number;

  constructor() {
    super(sceneConfig);
  }

  public init(): void {
    this.midX = window.innerWidth / 2;
    this.midY = window.innerHeight / 2;
  }

  public preload(): void {
    this.loading = this.add.text(20, 20, "Loading Game...");
    this.load.image('background', img);
    this.load.bitmapFont('myfont', font);
  }

  public create() {
    this.background = this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(window.innerWidth, window.innerHeight);

    this.menuContainer = new MenuContainer(this, this.midX, this.midY, 'Generic MMO');
    this.add.existing(this.menuContainer);

    this.loading.destroy();
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();

  }
}