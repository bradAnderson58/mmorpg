import * as _ from 'lodash';

import {MenuContainer} from "./menu-container";
import {TextButton} from "./text-button";


export class MenuInputContainer extends MenuContainer {
  private readonly submitButton: TextButton;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    title: string,
    submitButton: TextButton,
    ...uiElements: Phaser.GameObjects.GameObject[]
  ) {

    super(scene, x, y, title, submitButton, ...uiElements);

    this.submitButton = submitButton;

    _(uiElements)
      .filter(element => element.type === 'DOMElement')
      .forEach(element => element.addInputCallback(() => this.checkValidForms()));

    this.checkValidForms();
  }

  private checkValidForms(): void {
    const username = _.head(document.getElementsByClassName('username-input')).value;
    const password = _.head(document.getElementsByClassName('password-input')).value;

    if (!username || !password) {
      this.submitButton.disableButton();
    } else {
      this.submitButton.enableButton();
    }
  }
}