import * as _ from 'lodash';

export class PlayerControls {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private target: Phaser.GameObjects.Sprite;
  private moveKeys;
  private currentDirection: string = 'south';

  constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite) {
    this.scene = scene;
    this.sprite = sprite;
    this.moveKeys = scene.input.keyboard.addKeys({
      north: Phaser.Input.Keyboard.KeyCodes.W,
      west: Phaser.Input.Keyboard.KeyCodes.A,
      south: Phaser.Input.Keyboard.KeyCodes.S,
      east: Phaser.Input.Keyboard.KeyCodes.D
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

  public movePlayer() {
    this.updatePlayerPosition();
    this.setAnimation();
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

  private determineFacingDirection(angle: number): string {
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
    const faceAngle = this.determineFacingDirection(mouseAngle);
    const isMoving = _(this.moveKeys).map((val, key) => val).find(key => key.isDown);

    if (faceAngle !== this.currentDirection) {
      this.sprite.anims.play(`player-${faceAngle}`);
      this.currentDirection = faceAngle;
    }

    if (!isMoving) {
      this.sprite.anims.pause(this.sprite.anims.currentAnim.frames[1]);
    }else if (!this.sprite.anims.isPlaying) {
      this.sprite.anims.play(`player-${faceAngle}`);
    }
  }
}