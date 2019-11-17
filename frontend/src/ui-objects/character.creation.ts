import * as Phaser from "phaser";
import * as _ from 'lodash';
import {MenuInputContainer} from "./menu-input-container";
import {TextButton} from "./text-button";
import {DropdownField} from "./dropdown-field";
import {CharacterService} from "../services/character.service";
import {InputField} from "./input-field";
import {MessageService} from "../services/message.service";
import {CharacterDisplay} from "./character.display";
import {Character} from "../intefaces/character.interface";


export class CharacterCreation extends Phaser.GameObjects.Container {
  private menuInput: MenuInputContainer;
  private characterDisplay: CharacterDisplay;
  private returnFunction: () => void;
  private character: Character;

  constructor(scene: Phaser.Scene, x: number, y: number, ret: () => void) {
    super(scene, x, y);
    this.returnFunction = ret;
    this.character = {
      name: '',
      race: 'human',
      charClass: 'fighter',
      walkAnimation: {start: 9, end: 11},
      spriteSheet: 'chara5',
    };

    this.createMenu(x, y);
    this.characterDisplay = new CharacterDisplay(scene, x + (x * 0.35), y, this.character);

    scene.add.existing(this);
  }

  public destroy(): void {
    this.menuInput.destroy();
    this.characterDisplay.destroy();
    super.destroy();
  }

  private createMenu(x: number, y: number): void {
    const nameLabel = new Phaser.GameObjects.Text(this.scene, -125, -140, 'Name:', {fontFamily: 'gamefont', color: '#9fb364'});
    const classLabel = new Phaser.GameObjects.Text(this.scene, -150, -55, 'Class:', {fontFamily: 'gamefont', color: '#9fb364'});
    const raceLabel = new Phaser.GameObjects.Text(this.scene, 60, -55, 'Race:', {fontFamily: 'gamefont', color: '#9fb364'});

    const classDropdown = new DropdownField(this.scene, -150, -30, 'charClass')
      .setUpdateCallback((value: string) => this.switchClassSprite(value))
      .setOptions(CharacterService.getOptionsByLabel('charClass'));

    const raceDropdown = new DropdownField(this.scene, 60, -30, 'race')
      .setUpdateCallback((value: string) => this.switchRaceSprite(value))
      .setOptions(CharacterService.getOptionsByLabel('race'));

    this.menuInput = new MenuInputContainer(
      this.scene,
      x - (x * 0.34),
      y,
      'Create Character',
      new TextButton(this.scene, 0, 75, 'Create', () => this.sendCharacterCreate()),
      () => this.disableCharacterCreate(),
      nameLabel,
      new InputField(this.scene, 0, -100, 'name-input'),
      classLabel,
      classDropdown,
      raceLabel,
      raceDropdown,
      new TextButton(this.scene, 0, 150, 'Back', this.returnFunction),
    );
  }

  private switchClassSprite(value: string): void {
    this.character = CharacterService.findDefaultCharacter(this.character.race, value);
    this.characterDisplay.switchSprite(this.character);
  }

  private switchRaceSprite(value: string): void {
    this.character = CharacterService.findDefaultCharacter(value, this.character.charClass);
    this.characterDisplay.switchSprite(this.character);
  }

  private disableCharacterCreate(): boolean {
    const characterName = _.head(document.getElementsByClassName('name-input')).value;
    return !characterName;
  }

  private sendCharacterCreate(): void {
    this.character.name = _.head(document.getElementsByClassName('name-input')).value;

    CharacterService.create(this.character)
      .then(response => {
        console.log(response);
        MessageService.showSuccessMessage(`Character ${response} created`);
        this.returnFunction();
      }).catch(error => MessageService.showFailureMessage(`Something went wrong: ${error.message}`));
  }
}