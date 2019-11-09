import * as Phaser from "phaser";
import './styles/style.css';
import * as img from "./assets/menu_background.jpg";
import * as font from "./assets/ancient_modern.png";
import {TextButton} from "./game-objects/text-button";


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MenuScreen',
};

export class GameScene extends Phaser.Scene {
  private menuContainer: Phaser.GameObjects.Container;
  private menu: Phaser.GameObjects.Rectangle;
  private loading: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Image;
  private header: Phaser.GameObjects.Text;
  private loginButton: Phaser.GameObjects.Text;
  private createAccountButton: Phaser.GameObjects.Text;
  private midX: number;
  private midY: number;
  private center: number = 0;
  private menuMargin: number = 25;

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

    this.menuContainer = this.add.container(this.midX, this.midY);

    this.menu = this.createMenuBox();
    this.header = this.createMenuHeader();
    this.loginButton = new TextButton(this, 0, -50, 'Log In', this.loginAction);
    this.createAccountButton = new TextButton(this, 0, 50, 'Create Account', this.accountAction);

    this.menuContainer.add([this.menu, this.header, this.loginButton, this.createAccountButton]);

    this.loading.destroy();
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();

  }

  private loginAction(): void {
    console.log("log in plz");
  }

  private accountAction(): void {
    console.log('create an account!');
  }

  private createMenuBox(): Phaser.GameObjects.Rectangle {
    return this.add.rectangle(
      this.center, this.center,
      500,
      500,
      0x311047
    ) as any;
  }

  private createMenuHeader(): Phaser.GameObjects.Text {
    const headerStyle = {
      fontFamily: 'myfont',
      fill: "#6c855d",
      fontSize: '64px'
    };

    return this.add.text(
      this.center,
      this.calculateHeaderYBasedOnSquare(),
      "Generic MMO",
      headerStyle
    ).setOrigin(0.5, 0);
  }

  private calculateHeaderYBasedOnSquare(): number {
    const squareTop = -(this.menu.height / 2);
    return squareTop + this.menuMargin;
  }
}