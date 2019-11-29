

export class PlayerControls {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private target: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite) {
    this.scene = scene;
    this.sprite = sprite;

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

  public rotatePlayer() {
    if (this.scene.input.mouse.locked) {
      const mouseAngle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, this.target.x, this.target.y);
      const faceAngle = this.determineFacingDirection(mouseAngle);
      this.sprite.anims.load(`player-${faceAngle}`);
      //this.sprite.setFrame(1);
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
}