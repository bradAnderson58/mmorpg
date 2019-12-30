import * as Phaser from 'phaser';
import * as _ from 'lodash';
import {Character} from "../intefaces/character.interface";
import {MenuInputContainer} from "./menu-input-container";
import {TextButton} from "./text-button";
import {CharacterDisplay} from "./character.display";
import {DropdownField} from "./dropdown-field";
import {CleanContainer} from "./clean.container";

export class CharacterLoad extends CleanContainer {
  private characters: Character[];
  private selectedCharacter: Character;
  private menuInput: MenuInputContainer;
  private characterDisplay: CharacterDisplay;

  constructor(scene: Phaser.Scene, x: number, y: number, characters: Character[], ret: () => void) {
    super(scene, x, y);

    this.characters = characters;
    this.selectedCharacter = _.first(characters);
    this.createMenu(x, y, ret);
    this.characterDisplay = new CharacterDisplay(scene, x + (x * 0.35), y, _.first(this.characters).template);
  }

  public cleanDestroy(): void {
    this.menuInput.destroy();
    this.characterDisplay.cleanDestroy();
    this.destroy();
  }

  private createMenu(x: number, y: number, ret: () => void) {
    const charactersLabel = new Phaser.GameObjects.Text(this.scene, -100, -95, 'Character:', {fontFamily: 'gamefont', color: '#9fb364'});

    const characterDropdown = new DropdownField(this.scene, -100, -75, 'loadChar')
      .setUpdateCallback((name: string) => this.selectCharacter(name))
      .setOptions(_.map(this.characters, character => character.name));

    this.menuInput = new MenuInputContainer(
      this.scene,
      x - (x*0.34),
      y,
      'Load Character',
      new TextButton(this.scene, 0, 75, 'Load', () => this.sendCharacterLoad()),
      () => this.disableCharacterLoad(),
      charactersLabel,
      characterDropdown,
      new TextButton(this.scene, 0, 150, 'Back', ret),
    );
  }

  private sendCharacterLoad(): void {
    this.scene.scene.start('GameScene', this.selectedCharacter);
  }

  private selectCharacter(name: string): void {
    console.log(`selecting ${name}`);
    this.selectedCharacter = _.find(this.characters, character => character.name.toLowerCase() === name);
    this.characterDisplay.switchSprite(this.selectedCharacter.template);
  }

  private disableCharacterLoad(): boolean {
    return false;
  }
}