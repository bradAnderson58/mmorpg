import * as Phaser from "phaser";
import * as background from "../assets/keep_background.jpg";
import * as sample from "../assets/sample_knights_2x.png";
import * as char5 from "../assets/chara5.png";
import * as char2 from "../assets/chara2.png";
import * as char3 from "../assets/chara3.png";
import * as titleSong from "../assets/audio/title_screen.mp3";

import {MenuContainer} from "../ui-objects/menu-container";
import {TextButton} from "../ui-objects/text-button";
import {StorageService} from "../services/storage.service";
import {CharacterCreation} from "../ui-objects/character.creation";
import {CharacterLoad} from "../ui-objects/character.load";
import {CharacterService} from "../services/api-services/character.service";
import {MessageService} from "../services/message.service";
import {Character} from "../intefaces/character.interface";
import {CleanContainer} from "../ui-objects/clean.container";
import {SceneService} from "../services/scene.service";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MenuScene',
};

export class MenuScene extends Phaser.Scene {
  private menuContainer: CleanContainer;
  private loadButton: TextButton;
  private characters: Character[];
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
    this.load.audio('game-music', titleSong);

    this.load.spritesheet('sample_knights_2x', sample, {frameWidth: 78, frameHeight: 108});
    this.load.spritesheet('chara5', char5, {frameWidth: 78, frameHeight: 108});
    this.load.spritesheet('chara2', char2, {frameWidth: 78, frameHeight: 108});
    this.load.spritesheet('chara3', char3, {frameWidth: 78, frameHeight: 108});
  }

  public create() {
    this.background = this.add.image(0, 0, 'menu-background')
      .setOrigin(0,0)
      .setDisplaySize(window.innerWidth, window.innerHeight);

    SceneService.playMusic('game-music', this.sound, true);

    this.add.text(50, 50, StorageService.getUserName(), {
      fontFamily: 'gamefont',
      fill: "#6c855d",
      fontSize: '64px'
    });

    this.menuContainer = this.createMenuContainer();

    CharacterService.getAll().then(response => {
      this.characters = response.data;
      if (this.characters.length !== 0) {
        this.loadButton.enableButton();
      }
    }).catch(error => MessageService.showFailureMessage(`Something went wrong: ${error.message}`));

    this.loading.destroy();
  }

  private openCharacterCreation(): void {
    this.menuContainer.cleanDestroy();
    this.menuContainer = this.createCharacterCreation();
  }

  private openCharacterPicker(): void {
    this.menuContainer.destroy();
    this.menuContainer = this.createLoadCharacter();
  }

  private createMenuContainer(): CleanContainer {
    this.loadButton = new TextButton(this, 0, 50, 'Load Character', () => this.openCharacterPicker());
    this.loadButton.disableButton();
    return new MenuContainer(
      this,
      this.midX,
      this.midY,
      'Generic MMO',
      new TextButton(this, 0, -50, 'Create Character', () => this.openCharacterCreation()),
      this.loadButton,
    );
  }

  private createCharacterCreation(): CleanContainer {
    return new CharacterCreation(this, this.midX, this.midY, () => this.backToMenu());
  }

  private createLoadCharacter(): CleanContainer {
    return new CharacterLoad(this, this.midX, this.midY, this.characters, () => this.backToMenu());
  }

  private backToMenu(): void {
    this.menuContainer.cleanDestroy();
    this.menuContainer = this.createMenuContainer();
    if (this.characters.length !== 0) {
      this.loadButton.enableButton();
    }
  }
}