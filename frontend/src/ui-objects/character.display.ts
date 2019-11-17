import * as Phaser from 'phaser';
import {Character} from "../intefaces/character.interface";

export class CharacterDisplay extends Phaser.GameObjects.Container {
  private character: Character;
  private sprite: Phaser.GameObjects.Sprite;
  public readonly WIDTH_RATIO: number = 0.72;

  constructor(scene: Phaser.Scene, x: number, y: number, character: Character) {
    super(scene, x, y);

    this.character = character;

    this.add([
      this.createBackdrop(),
      this.createSprite(this.character)
    ]);

    scene.add.existing(this);
  }

  public destroy(): void {
    this.scene.anims.remove('display-anim');
    this.sprite.destroy();
    super.destroy();
  }

  private createBackdrop(): Phaser.GameObjects.Rectangle {
    return this.scene.add.rectangle(0, 0, 500, 500, 0x000);
  }

  private createSprite(character: Character): Phaser.GameObjects.Sprite {
    this.sprite = this.scene.add.sprite(0, 0, character.spriteSheet)
      .setDisplaySize(200 * this.WIDTH_RATIO, 200)
      .setName('display-sprite');

    this.scene.anims.create({
      key: 'display-anim',
      frames: this.scene.anims.generateFrameNumbers(character.spriteSheet, character.walkAnimation),
      frameRate: 6,
      repeat: -1
    });

    this.sprite.anims.load('display-anim');
    this.sprite.anims.play('display-anim');
    return this.sprite;
  }

  public switchSprite(character: Character): Phaser.GameObjects.Sprite {
    this.scene.anims.remove('display-anim');
    this.sprite.destroy();
    this.add(this.createSprite(character));
    return this.sprite;
  }
}