import * as Phaser from "phaser";
import './styles/style.css';
import * as img from "./assets/menu_background.jpg";
import * as font from "./assets/ancient_modern.png";


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MenuScreen',
};

export class GameScene extends Phaser.Scene {
  private menuContainer: Phaser.GameObjects.Container;
  private menu: Phaser.GameObjects.Rectangle & {body: Phaser.Physics.Arcade.Body};
  private loading: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Image;
  private header: Phaser.GameObjects.Text;
  private midX: number;
  private midY: number;
  private center: number = 0;
  private fontSize: number = 32;
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

    this.menuContainer.add([this.menu, this.header]);

    this.loading.destroy();
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();

  }

  private createMenuBox(): any {
    const menu = this.add.rectangle(
      this.center, this.center,
      500,
      500,
      0x311047
    ) as any;
    this.physics.add.existing(menu);
    return menu;
  }

  private createMenuHeader(): Phaser.GameObjects.Text {
    const headerStyle = {
      fontFamily: 'myfont',
      fill: "#6c855d",
      fontSize: '52px'
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