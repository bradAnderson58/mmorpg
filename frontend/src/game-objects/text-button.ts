
import * as Phaser from 'phaser';

export class TextButton extends Phaser.GameObjects.Text {
  private readonly callback: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | string[],
    callback: () => void,
    style?: Phaser.Types.GameObjects.Text.TextStyle,
  ) {
    const buttonStyle = {
      color: '#9fb364',
      fontFamily: 'myfont',
      fontSize: '32px',
      fixedWidth: 200,
      align: 'center',
      backgroundColor: '#8b2747',
      padding: {x: 5, y: 5},
    };

    super(scene, x, y, text, buttonStyle);

    this.callback = callback;

    this.setInteractive({ useHandCursor: true })
      .setOrigin(0.5, 0)
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonRestState())
      .on('pointerup', () => this.buttonClicked());
  }

  private enterButtonHoverState() {
    this.setStyle({
      color: '#e5db48',
      backgroundColor: '#b25c34'
    });
  }

  private enterButtonRestState() {
    this.setStyle({
      color:'#9fb364',
      backgroundColor: '#8b2747'
    });
  }

  private buttonClicked() {
    this.callback();
    this.enterButtonHoverState();
  }
}
