import * as Phaser from 'phaser';
import * as _ from 'lodash';
import {Character} from "../intefaces/character.interface";
import {MenuInputContainer} from "./menu-input-container";
import {TextButton} from "./text-button";
import {CharacterDisplay} from "./character.display";
import {DropdownField} from "./dropdown-field";

export class CharacterLoad extends Phaser.GameObjects.Container {
  private characters: Character[];
  private menuInput: MenuInputContainer;
  private characterDisplay: CharacterDisplay;

  constructor(scene: Phaser.Scene, x: number, y: number, characters: Character[], ret: () => void) {
    super(scene, x, y);

    this.characters = characters;
    this.createMenu(x, y, ret);
    this.characterDisplay = new CharacterDisplay(scene, x + (x * 0.35), y, _.first(this.characters));
  }

  public destroy(): void {
    this.menuInput.destroy();
    this.characterDisplay.destroy();
    super.destroy();
  }

  private createMenu(x: number, y: number, ret: () => void) {
    const charactersLabel = new Phaser.GameObjects.Text(this.scene, 0, 100, 'Character:', {fontFamily: 'gamefont', color: '#9fb364'});

    const characterDropdown = new DropdownField(this.scene, 0, 0, 'loadChar')
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
    console.log('load');
  }

  private selectCharacter(name: string): void {
    console.log(`selecting ${name}`);
    const character = _.find(this.characters, character => character.name === name);
    this.characterDisplay.switchSprite(character);
  }

  private disableCharacterLoad(): boolean {
    return false;
  }
}