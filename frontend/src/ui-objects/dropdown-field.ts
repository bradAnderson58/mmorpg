import * as _ from 'lodash';
import {CharacterDisplay} from "../services/character.display";

export class DropdownField extends Phaser.GameObjects.DOMElement {
  private readonly htmlElement;
  private readonly updateCallback: (number) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, updateCallback: (number) => void) {

    super(scene, x, y, 'select', 'font: 32px myfont');
    this.setOrigin(0,0);
    this.setClassName('class-dropdown');

    this.htmlElement = _.head(document.getElementsByClassName('class-dropdown'));
    this.updateCallback = updateCallback;

    this.setOptions();

    this.addListener('change').on('change', this.handleChange);
  }

  public addInputCallback(f: () => void): DropdownField {
    console.log('hello');

    return this;
  }

  private setOptions(): void {
    const options = ['Wizard', 'Fighter', 'Rogue', 'Cleric'];
    let val = 0;

    options.forEach(option => {
      const el = document.createElement('option');
      el.text = option;
      el.value = (val++).toString();
      this.htmlElement.appendChild(el);
    });

  }

  private handleChange(event): void {
    console.log(this.htmlElement.selectedIndex);
    this.updateCallback(this.htmlElement.selectedIndex);
  }
}