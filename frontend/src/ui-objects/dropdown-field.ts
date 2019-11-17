import * as _ from 'lodash';

export class DropdownField extends Phaser.GameObjects.DOMElement {
  private readonly htmlElement;
  private updateCallback: (...args) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, label: string) {

    super(scene, x, y, 'select', 'font: 32px myfont');
    this.setOrigin(0,0);
    this.setClassName(`${label}-dropdown`);

    this.htmlElement = _.head(document.getElementsByClassName(`${label}-dropdown`));
    this.addListener('change').on('change', this.handleChange);
  }

  public addInputCallback(f: () => void): DropdownField {
    return this;
  }

  public setUpdateCallback(f: (...args) => void): DropdownField {
    this.updateCallback = f;
    return this;
  }

  public setOptions(options: string[]): DropdownField {
    options.forEach(option => {
      const el = document.createElement('option');
      el.text = option;
      el.value = option.toLowerCase();
      this.htmlElement.appendChild(el);
    });

    return this;
  }

  private handleChange(event): void {
    this.updateCallback(this.htmlElement.value);
  }
}