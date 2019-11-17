import * as Phaser from 'phaser';
import {CharacterService} from "../services/character.service";
import {Character} from "../intefaces/character.interface";
import {MenuInputContainer} from "./menu-input-container";
import {TextButton} from "./text-button";

export class CharacterLoad extends Phaser.GameObjects.Container {
  private characters: Character[];
  private menuInput: MenuInputContainer;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const farx = x + (x * 0.35);
    super(scene, farx, y);

    CharacterService.getAll().then(response => {
      this.characters = response.data;
      console.log(this.characters);
    });

    this.menuInput = new MenuInputContainer(
      scene,
      x - (x*0.34),
      y,
      'Load Character',
      new TextButton(scene, 0, 75, 'Load', () => this.sendCharacterLoad()),
      () => this.disableCharacterLoad(),
    )
  }

  private sendCharacterLoad(): void {
    console.log('load');
  }

  private disableCharacterLoad(): boolean {
    return false;
  }
}