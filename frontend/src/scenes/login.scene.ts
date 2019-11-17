import * as Phaser from "phaser";
import * as _ from 'lodash';
import '../styles/style.css';
import * as img from "../assets/menu_background.jpg";
import * as font from "../assets/ancient_modern.png";
import {TextButton} from "../ui-objects/text-button";
import {MenuContainer} from "../ui-objects/menu-container";
import {InputField} from "../ui-objects/input-field";
import {MenuInputContainer} from "../ui-objects/menu-input-container";
import {AccountService} from "../services/account.service";
import {MessageService} from "../services/message.service";
import {StorageService} from "../services/storage.service";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'LoginScene',
};

export class LoginScene extends Phaser.Scene {
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
    if (StorageService.isLoggedIn()) {
      this.scene.start('MenuScene');
    }
    this.loading = this.add.text(20, 20, "Loading Game...");
    this.load.image('login-background', img);
    this.load.bitmapFont('myfont', font);
  }

  public create() {
    this.background = this.add.image(0, 0, 'login-background')
      .setOrigin(0, 0)
      .setDisplaySize(window.innerWidth, window.innerHeight);

    this.menuContainer = this.mainMenuContainer();

    this.loading.destroy();
  }

  public update(time: number, delta: number): void {
    const cursorKeys = this.input.keyboard.createCursorKeys();
  }

  private loginMenuAction(): void {
    this.menuContainer.destroy();
    this.menuContainer = this.createSubmissionForm('Log In', () => this.loginAction());
  }

  private accountMenuAction(): void {
    this.menuContainer.destroy();
    this.menuContainer = this.createSubmissionForm('Create', () => this.createAccountAction());
  }

  private returnToMainAction(): void {
    this.menuContainer.destroy();
    this.menuContainer = this.mainMenuContainer();
  }

  private createAccountAction(): void {
    const username = _.head(document.getElementsByClassName('username-input')).value;
    const password = _.head(document.getElementsByClassName('password-input')).value;

    AccountService.create(username, password)
      .then(data => {
        MessageService.showSuccessMessage("Successfully Registered! Sign in with new account");
        this.returnToMainAction();
      }).catch(error => {
        MessageService.showFailureMessage(`Something went wrong: ${error.message}`);
      });
  }

  private loginAction(): void {
    const username = _.head(document.getElementsByClassName('username-input')).value;
    const password = _.head(document.getElementsByClassName('password-input')).value;

    AccountService.login(username, password)
      .then(response => {
        StorageService.storeUserAndToken(response.data);
        MessageService.showSuccessMessage("Login Success");
        this.scene.start('MenuScene');
      }).catch(error => {
        MessageService.showFailureMessage(`Something went wrong: ${error.message}`);
    })
  }

  private disableAccountSubmit(): boolean {
    const username = _.head(document.getElementsByClassName('username-input')).value;
    const password = _.head(document.getElementsByClassName('password-input')).value;

    return (!username || !password);
  }

  private mainMenuContainer(): Phaser.GameObjects.Container {
    return new MenuContainer(
      this,
      this.midX,
      this.midY,
      'Generic MMO',
      new TextButton(this, 0, -50, 'Log In', () => this.loginMenuAction()),
      new TextButton(this, 0, 50, 'Create Account', () => this.accountMenuAction())
    );
  }

  private createSubmissionForm(submitLabel: string, submitCallback: () => void): Phaser.GameObjects.Container {
    const nameLabel = new Phaser.GameObjects.Text(this, -130, -110, 'Username:', {fontFamily: 'myfont', color: '#9fb364'});
    const passLabel = new Phaser.GameObjects.Text(this, -130, -20, 'Password:', {fontFamily: 'myfont', color: '#9fb364'});

    return new MenuInputContainer(
      this,
      this.midX,
      this.midY,
      `Account ${submitLabel}`,
      new TextButton(this, 0, 75, submitLabel, submitCallback),
      this.disableAccountSubmit,
      nameLabel,
      new InputField(this, 0, -70, 'username-input'),
      passLabel,
      new InputField(this, 0, 20, 'password-input'),
      new TextButton(this, 0, 150, 'Back', () => this.returnToMainAction())
    );
  }
}