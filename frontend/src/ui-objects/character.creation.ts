import * as Phaser from "phaser";
import {MenuInputContainer} from "./menu-input-container";
import {TextButton} from "./text-button";
import {DropdownField} from "./dropdown-field";
import {CharacterDisplay} from "../services/character.display";


export class CharacterCreation extends Phaser.GameObjects.Container {
  private menuInput: MenuInputContainer;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const farx = x + (x * 0.35);
    super(scene, farx, y);

    const classLabel = new Phaser.GameObjects.Text(scene, -150, -110, 'Class:', {fontFamily: 'gamefont', color: '#9fb364'});
    this.menuInput = new MenuInputContainer(
      scene,
      x - (x * 0.34),
      y,
      'Create Character',
      new TextButton(scene, 0, 75, 'Create', () => console.log('submitted')),
      () => true,
      classLabel,
      new DropdownField(scene, -150, -80, (index: number) => this.switchSprite(index)),
    );

    this.add([
      this.createBackdrop(),
      this.createSprite(0),
    ]);

    scene.add.existing(this);
  }

  private createBackdrop(): Phaser.GameObjects.Rectangle {
    return this.scene.add.rectangle(0, 0, 500, 500, 0x000000);
  }

  private createSprite(index: number): Phaser.GameObjects.Sprite {
    const spriteDef = CharacterDisplay.getCharacter(this.scene, index);
    const sprite = this.scene.add.sprite(0, 0, spriteDef.spriteSheet)
      .setDisplaySize(200*CharacterDisplay.WIDTH_RATIO, 200);

    sprite.setName('demo-sprite');

    sprite.anims.load(spriteDef.animation);
    sprite.anims.play(spriteDef.animation);
    return sprite;
  }

  private switchSprite(index: number): void {
    this.getByName('demo-sprite').destroy(true);
    const newSprite = this.createSprite(index);
    this.add(newSprite);
  }
}