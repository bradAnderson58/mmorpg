
import * as Phaser from 'phaser';

export class InputField extends Phaser.GameObjects.DOMElement {

  constructor(scene: Phaser.Scene, x: number, y: number, className: string) {

    super(scene, x, y, 'input', 'font: 32px gamefont');
    this.setClassName(className);
  }

  public addInputCallback(f: () => void): InputField {
    this.addListener('input').on('input', f);

    return this;
  }

}