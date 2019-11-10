import * as Phaser from "phaser";
import * as background from "../assets/keep_background.jpg";
import * as sample from "../assets/sample_knights_2x.png";
import * as font from "../assets/ancient_modern.png";
import {MenuContainer} from "../game-objects/menu-container";
import {TextButton} from "../game-objects/text-button";
import {StorageService} from "../services/storage.service";
import {MenuInputContainer} from "../game-objects/menu-input-container";

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
    const classLabel = new Phaser.GameObjects.Text(this, -130, -110, 'Class:', {fontFamily: 'gamefont', color: '#9fb364'});
    const menu = new MenuInputContainer(
      this,
      this.midX - (this.midX * .34),
      this.midY,
      'Create Character',
      new TextButton(this, 0, 75, 'Create', () => console.log("submitted")),
      () => true,
      classLabel,

    );
    const back = this.add.rectangle(this.midX + (this.midX * .35), this.midY, 500, 500, 0x000000);
    this.add.existing(back);
    const sprite = this.add.sprite(this.midX + (this.midX * .35), this.midY,  'sample').setDisplaySize(200*this.WIDTH_RATIO, 200);
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('sample', {start: 3, end: 5}),
      frameRate: 6,
      repeat: -1
    });

    sprite.anims.load('walk');
    sprite.anims.play('walk');
    return menu;
  }
}