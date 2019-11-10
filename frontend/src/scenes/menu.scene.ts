import * as Phaser from "phaser";
import * as background from "../assets/keep_background.jpg";
import * as sample from "../assets/sample_knights_2x.png";
import * as font from "../assets/ancient_modern.png";
import {MenuContainer} from "../ui-objects/menu-container";
import {TextButton} from "../ui-objects/text-button";
import {StorageService} from "../services/storage.service";
import {MenuInputContainer} from "../ui-objects/menu-input-container";
import {CharacterCreation} from "../ui-objects/character.creation";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MenuScene',
};

export class MenuScene extends Phaser.Scene {
  private WIDTH_RATIO: number = 0.72;
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
    this.loading = this.add.text(20, 20, 'Loading Game...');
    this.load.image('menu-background', background);
    this.load.bitmapFont('gamefont', font);
    this.load.spritesheet('sample', sample, {frameWidth: 52, frameHeight: 72})
  }

  public create() {
    this.background = this.add.image(0, 0, 'menu-background')
      .setOrigin(0,0)
      .setDisplaySize(window.innerWidth, window.innerHeight);

    this.add.text(50, 50, StorageService.getUserName(), {
      fontFamily: 'myfont',
      fill: "#6c855d",
      fontSize: '64px'
    });

    this.menuContainer = this.createMenuContainer();

    this.loading.destroy();
  }

  private openCharacterCreation(): void {
    console.log('open char creation');
    this.menuContainer.destroy();
    this.menuContainer = this.createCharacterCreation();
  }

  private openCharacterPicker(): void {
    console.log('load a char');
  }

  private createMenuContainer(): Phaser.GameObjects.Container {
    return new MenuContainer(
      this,
      this.midX,
      this.midY,
      'Generic MMO',
      new TextButton(this, 0, -50, 'Create Character', () => this.openCharacterCreation()),
      new TextButton(this, 0, 50, 'Load Character', () => this.openCharacterPicker())
    );
  }

  private createCharacterCreation(): Phaser.GameObjects.Container {
    const menu = new CharacterCreation(this, this.midX, this.midY);
    return menu;
  }
}