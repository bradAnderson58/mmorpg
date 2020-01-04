import * as Phaser from "phaser";
import * as _ from 'lodash';
import {MenuInputContainer} from "./menu-input-container";
import {TextButton} from "./text-button";
import {DropdownField} from "./dropdown-field";
import {CharacterService} from "../services/api-services/character.service";
import {InputField} from "./input-field";
import {MessageService} from "../services/message.service";
import {CharacterDisplay} from "./character.display";
import {CharacterTemplate} from "../intefaces/character.interface";
import {CleanContainer} from "./clean.container";
import Text = Phaser.GameObjects.Text;

export class CharacterCreation extends CleanContainer {
  private menuInput: MenuInputContainer;
  private characterDisplay: CharacterDisplay;
  private returnFunction: () => void;
  private characterTemplates: CharacterTemplate[];
  private selectedTemplate: CharacterTemplate;

  constructor(scene: Phaser.Scene, x: number, y: number, ret: () => void) {
    super(scene, x, y);
    this.returnFunction = ret;
    CharacterService.getCharacterTemplates().then(response => {
      this.characterTemplates = response.data;

      this.selectedTemplate = _.first(this.characterTemplates);
      this.createMenu(x, y);
      this.characterDisplay = new CharacterDisplay(scene, x + (x * 0.35), y, this.selectedTemplate);

      scene.add.existing(this);
    });
  }

  public cleanDestroy(): void {
    this.menuInput.destroy();
    this.characterDisplay.cleanDestroy();
    this.destroy();
  }

  private createMenu(x: number, y: number): void {
    const nameLabel = new Text(this.scene, -125, -140, 'Name:', {fontFamily: 'gamefont', color: '#9fb364'});
    const classLabel = new Text(this.scene, -150, -55, 'Class:', {fontFamily: 'gamefont', color: '#9fb364'});
    const raceLabel = new Text(this.scene, 60, -55, 'Race:', {fontFamily: 'gamefont', color: '#9fb364'});

    const classDropdown = new DropdownField(this.scene, -150, -30, 'charClass')
      .setUpdateCallback((value: string) => this.switchClassSprite(value))
      .setOptions(this.getOptionsByField('characterClass'));

    const raceDropdown = new DropdownField(this.scene, 60, -30, 'race')
      .setUpdateCallback((value: string) => this.switchRaceSprite(value))
      .setOptions(this.getOptionsByField('race'));

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
    this.selectedTemplate = this.findDefaultCharacter(this.selectedTemplate.race, value);
    this.characterDisplay.switchSprite(this.selectedTemplate);
  }

  private switchRaceSprite(value: string): void {
    this.selectedTemplate = this.findDefaultCharacter(value, this.selectedTemplate.characterClass);
    this.characterDisplay.switchSprite(this.selectedTemplate);
  }

  private disableCharacterCreate(): boolean {
    const characterName = _.head(document.getElementsByClassName('name-input')).value;
    return !characterName;
  }

  private sendCharacterCreate(): void {
    const name = _.head(document.getElementsByClassName('name-input')).value;

    CharacterService.create(this.selectedTemplate.id, name)
      .then(response => {
        MessageService.showSuccessMessage(`Character ${response.data.name} created`);
        this.scene.scene.start('GameScene', response.data);
      }).catch(error => MessageService.showFailureMessage(`Something went wrong: ${error.message}`));
  }

  private getOptionsByField(field: string): string[] {
    return _(this.characterTemplates)
      .uniqBy(field)
      .map(template => template[field].charAt(0).toLocaleUpperCase() + template[field].slice(1));
  }

  private findDefaultCharacter(race: string, characterClass: string): CharacterTemplate {
    return _.find(
      this.characterTemplates,
      template => template.race === race && template.characterClass === characterClass
    );
  }
}