
import * as Phaser from 'phaser';
import {TextButton} from "./text-button";

export class MenuContainer extends Phaser.GameObjects.Container {
  private menuBox: Phaser.GameObjects.Rectangle;

  private readonly center: number = 0;
  private readonly menuMargin: number = 25;

  constructor(scene: Phaser.Scene, x?: number, y?: number, title?: string) {

    super(scene, x, y);

    this.add([
      this.createMenuBox(),
      this.createMenuHeader(title),
      new TextButton(scene, 0, -50, 'Log In', this.loginAction),
      new TextButton(scene, 0, 50, 'Create Account', this.accountAction)
    ])
  }

  private loginAction(): void {
    console.log("log in plz");
  }


  private accountAction(): void {
    console.log('create an account!');
  }

  private createMenuBox(): Phaser.GameObjects.Rectangle {
    this.menuBox = this.scene.add.rectangle(
      this.center, this.center,
      500,
      500,
      0x311047
    );
    return this.menuBox;
  }

  private createMenuHeader(title?: string): Phaser.GameObjects.Text {
    if (!title) {
      return this.scene.add.text(0,0,'',{});
    }
    const headerStyle = {
      fontFamily: 'myfont',
      fill: "#6c855d",
      fontSize: '64px'
    };

    return this.scene.add.text(
      this.center,
      this.calculateHeaderYBasedOnSquare(),
      "Generic MMO",
      headerStyle
    ).setOrigin(0.5, 0);
  }

  private calculateHeaderYBasedOnSquare(): number {
    const squareTop = -(this.menuBox.height / 2);
    return squareTop + this.menuMargin;
  }
}