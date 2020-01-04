import * as _ from 'lodash';
import {CharacterTemplate} from "../intefaces/character.interface";
import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;

export class PlayerControls {
  private scene: Scene;
  private sprite: Sprite;
  private target: Sprite;
  private moveKeys;
  private currentDirection: string = 'south';

  constructor(scene: Scene, template: CharacterTemplate) {
    this.scene = scene;
    this.sprite = this.createSprite('player', template);
    scene.cameras.main.startFollow(this.sprite);
    this.moveKeys = scene.input.keyboard.addKeys({
      north: Phaser.Input.Keyboard.KeyCodes.W,
      west: Phaser.Input.Keyboard.KeyCodes.A,
      south: Phaser.Input.Keyboard.KeyCodes.S,
      east: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.target = scene.physics.add.sprite(200, 200, 'target').setDisplaySize(25, 25).setOrigin(0.5, 0.5);

    scene.game.canvas.addEventListener('mousedown', () => scene.game.input.mouse.requestPointerLock());
    scene.input.keyboard.on('keydown_Q', event => {
      if (scene.game.input.mouse.locked) {
        scene.game.input.mouse.releasePointerLock();
      }
    });
    scene.input.on('pointermove', pointer => {
      if (scene.input.mouse.locked) {
        this.target.x += pointer.movementX;
        this.target.y += pointer.movementY;
      }
    }, this);

  }

  public movePlayer(): void {
    this.updatePlayerPosition();
    this.setAnimation();
  }

  public pausePlayer(): void {
    this.sprite.anims.pause(this.sprite.anims.currentAnim.frames[1]);
  }

  private updatePlayerPosition(): void {
    if (this.moveKeys.north.isDown) {
      this.sprite.y -= 4;
    }
    if (this.moveKeys.south.isDown) {
      this.sprite.y += 4;
    }

    if (this.moveKeys.east.isDown) {
      this.sprite.x += 4;
    }
    if (this.moveKeys.west.isDown) {
      this.sprite.x -= 4;
    }
  }

  private static determineFacingDirection(angle: number): string {
    if (angle <= 0.78 && angle > -0.78) {
      return 'east';
    }
    if (angle <= 2.35 && angle > 0.78) {
      return 'south';
    }
    if ((angle <= 3.14 && angle > 2.35) || (angle <= -2.35 && angle > -3.14)) {
      return 'west';
    }
    if (angle <= -0.78 && angle > -2.35) {
      return 'north';
    }
    console.log(`bad angle: ${angle}`);
    return 'ERROR';
  }

  private setAnimation(): void {
    const mouseAngle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, this.target.x, this.target.y);
    const faceAngle = PlayerControls.determineFacingDirection(mouseAngle);
    const isMoving = _(this.moveKeys).map((val, key) => val).find(key => key.isDown);

    if (faceAngle !== this.currentDirection) {
      this.sprite.anims.play(`player-${faceAngle}`);
      this.currentDirection = faceAngle;
    }

    if (!isMoving) {
      this.sprite.anims.pause(this.sprite.anims.currentAnim.frames[1]);
    }
  }

  private createSprite(name: string, template: CharacterTemplate, x: number = 200, y: number = 200): Sprite {
    const sprite = this.scene.add.sprite(x, y, name).setName(`${name}-sprite`);
    ['north', 'south', 'east', 'west'].forEach(direction => {
      this.scene.anims.create({
        key: `${name}-${direction}`,
        frames: this.scene.anims.generateFrameNumbers(name, template.animations[direction]),
        frameRate: 6,
        repeat: -1,
      })
    });

    sprite.anims.load(`${name}-south`);
    sprite.setFrame(1);
    return sprite;
  }
}
