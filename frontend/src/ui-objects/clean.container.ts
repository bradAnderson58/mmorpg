import * as Phaser from 'phaser';


export abstract class CleanContainer extends Phaser.GameObjects.Container {
  abstract cleanDestroy(): void;
}