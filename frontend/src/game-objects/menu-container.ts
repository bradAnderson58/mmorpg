import * as Phaser from 'phaser';

export class MenuContainer extends Phaser.GameObjects.Container {
  private menuBox: Phaser.GameObjects.Rectangle;

  private readonly center: number = 0;
  private readonly menuMargin: number = 25;

  constructor(scene: Phaser.Scene, x: number, y: number, title: string, ...uiElements: Phaser.GameObjects.GameObject[]) {

    super(scene, x, y);

    this.add([
      this.createMenuBox(),
      this.createMenuHeader(title),
      ...uiElements
    ]);

    scene.add.existing(this);
  }

  public destroy(): void {
    this.removeAll(true);
    super.destroy();
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
      title,
      headerStyle
    ).setOrigin(0.5, 0);
  }

  private calculateHeaderYBasedOnSquare(): number {
    const squareTop = -(this.menuBox.height / 2);
    return squareTop + this.menuMargin;
  }
}