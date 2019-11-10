
import * as Phaser from 'phaser';

interface SpriteDefinition {
  spriteSheet: string;
  animation: string;
}

export class CharacterDisplay {
  public static readonly WIDTH_RATIO: number = 0.72;

  private static ANIMATION = {};

  private static readonly FRAMES = {
    1: {start: 0, end: 2},
    3: {start: 3, end: 5},
    2: {start: 6, end: 8},
    0: {start: 9, end: 11}
  };

  public static getCharacter(scene: Phaser.Scene, spriteIndex: number): SpriteDefinition {
    if (!this.ANIMATION[spriteIndex]) {
      this.ANIMATION[spriteIndex] = this.createSpriteAnimation(scene, spriteIndex);
    }

    return {
      spriteSheet: 'sample',
      animation: this.ANIMATION[spriteIndex],
    };
  }

  private static createSpriteAnimation(scene: Phaser.Scene, frameIndex: number): string {
    scene.anims.create({
      key: `walk${frameIndex}`,
      frames: scene.anims.generateFrameNumbers('sample', this.FRAMES[frameIndex]),
      frameRate: 6,
      repeat: -1
    });

    return `walk${frameIndex}`;
  }
}