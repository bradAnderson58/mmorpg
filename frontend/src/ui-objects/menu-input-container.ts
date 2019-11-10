import * as _ from 'lodash';

import {MenuContainer} from "./menu-container";
import {TextButton} from "./text-button";


export class MenuInputContainer extends MenuContainer {
  private readonly submitButton: TextButton;
  private readonly disableSubmit: () => boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    title: string,
    submitButton: TextButton,
    disableSubmit: () => boolean,
    ...uiElements: Phaser.GameObjects.GameObject[]
  ) {

    super(scene, x, y, title, submitButton, ...uiElements);

    this.submitButton = submitButton;
    this.disableSubmit = disableSubmit;

    _(uiElements)
      .filter(element => element.type === 'DOMElement')
      .forEach(element => element.addInputCallback(() => this.checkValidForms()));

    this.checkValidForms();
  }

  private checkValidForms(): void {
    if (this.disableSubmit()) {
      this.submitButton.disableButton();
    } else {
      this.submitButton.enableButton();
    }
  }
}