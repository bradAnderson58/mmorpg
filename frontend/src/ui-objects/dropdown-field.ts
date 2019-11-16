import * as _ from 'lodash';
import {CharacterDisplay} from "../services/character.display";

export class DropdownField extends Phaser.GameObjects.DOMElement {
  private readonly htmlElement;
  private readonly updateCallback: (s1: string, s2: string) => void;
  private readonly label: string;

  constructor(scene: Phaser.Scene, x: number, y: number, label: string, updateCallback: (s1, s2) => void) {

    super(scene, x, y, 'select', 'font: 32px myfont');
    this.setOrigin(0,0);
    this.setClassName(`${label}-dropdown`);

    this.htmlElement = _.head(document.getElementsByClassName(`${label}-dropdown`));
    this.updateCallback = updateCallback;
    this.label = label;

    this.setOptions();

    this.addListener('change').on('change', this.handleChange);
  }

  public addInputCallback(f: () => void): DropdownField {
    console.log('hello');

    return this;
  }

  private setOptions(): void {
    const options = CharacterDisplay.getOptionsByLabel(this.label);
    let val = 0;

    options.forEach(option => {
      const el = document.createElement('option');
      el.text = option;
      el.value = option.toLowerCase();
      this.htmlElement.appendChild(el);
    });

  }

  private handleChange(event): void {
    this.updateCallback(this.label, this.htmlElement.value);
  }
}