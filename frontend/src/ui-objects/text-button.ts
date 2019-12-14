
import * as Phaser from 'phaser';

export class TextButton extends Phaser.GameObjects.Text {
  private readonly clickCallback: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | string[],
    clickCallback: () => void
  ) {
    const buttonStyle = {
      color: '#9fb364',
      fontFamily: 'gamefont',
      fontSize: '32px',
      fixedWidth: 200,
      align: 'center',
      backgroundColor: '#8b2747',
      padding: {x: 5, y: 5},
    };

    super(scene, x, y, text, buttonStyle);

    this.clickCallback = clickCallback;

    this.setOrigin(0.5, 0).enableButton()
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonRestState())
      .on('pointerup', () => this.buttonClicked());
  }

  public disableButton(): TextButton {
    this.disableInteractive()
      .setStyle({
        color: '#A0A0A0',
        backgroundColor: '#D3D3D3'
      });
    return this;
  }

  public enableButton(): TextButton {
    this.setInteractive({ useHandCursor: true })
      .enterButtonRestState();
    return this;
  }

  private enterButtonHoverState(): TextButton {
    this.setStyle({
      color: '#e5db48',
      backgroundColor: '#b25c34'
    });
    return this;
  }

  private enterButtonRestState(): TextButton {
    this.setStyle({
      color:'#9fb364',
      backgroundColor: '#8b2747'
    });
    return this;
  }

  private buttonClicked(): TextButton {
    this.enterButtonHoverState();
    this.clickCallback();
    return this;
  }
}
