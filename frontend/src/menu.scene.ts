import * as Phaser from "phaser";
import * as _ from 'lodash';
import './styles/style.css';
import * as img from "./assets/menu_background.jpg";
import * as font from "./assets/ancient_modern.png";
import {TextButton} from "./game-objects/text-button";
import {MenuContainer} from "./game-objects/menu-container";
import {InputField} from "./game-objects/input-field";
import {MenuInputContainer} from "./game-objects/menu-input-container";
import {AccountService} from "./services/account.service";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MenuScreen',
};

export class GameScene extends Phaser.Scene {
  private menuContainer: Phaser.GameObjects.Container;
  private loading: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Image;
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

    this.menuContainer = this.mainMenuContainer();

    this.loading.destroy();
  }

  public update(time: number, delta: number): void {
    const cursorKeys = this.input.keyboard.createCursorKeys();
  }

  private loginAction(): void {
    console.log("log in plz");
  }

  private accountAction(): void {
    this.menuContainer.removeAll();
    this.menuContainer.destroy();
    this.menuContainer = this.accountCreationContainer();
  }

  private createAction(): void {
    console.log('submit action');
    const username = _.head(document.getElementsByClassName('username-input')).value;
    const password = _.head(document.getElementsByClassName('password-input')).value;
    AccountService.create(username, password);
  }

  private mainMenuContainer(): Phaser.GameObjects.Container {
    return new MenuContainer(
      this,
      this.midX,
      this.midY,
      'Generic MMO',
      new TextButton(this, 0, -50, 'Log In', () => this.loginAction()),
      new TextButton(this, 0, 50, 'Create Account', () => this.accountAction())
    );
  }

  private accountCreationContainer(): Phaser.GameObjects.Container {
    const nameLabel = new Phaser.GameObjects.Text(this, -130, -110, 'Username:', {fontFamily: 'myfont', color: '#9fb364'});
    const passLabel = new Phaser.GameObjects.Text(this, -130, -20, 'Password:', {fontFamily: 'myfont', color: '#9fb364'});

    return new MenuInputContainer(
      this,
      this.midX,
      this.midY,
      'Create New Account',
      new TextButton(this, 0, 100, 'Create', () => this.createAction()),
      nameLabel,
      new InputField(this, 0, -70, 'username-input'),
      passLabel,
      new InputField(this, 0, 20, 'password-input'),
    );
  }
}