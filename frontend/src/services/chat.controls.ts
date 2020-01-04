import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;
import Keyboard = Phaser.Input.Keyboard;

export class ChatControls {
  private readonly scene: Scene;
  private inputBuffer: string = '...';
  private inputText: Text;
  private texting: boolean = false;
  private chatKey;

  constructor(scene: Scene) {
    this.scene = scene;
    this.chatKey = Keyboard.KeyCodes.BACK_SLASH;
    scene.input.keyboard.on('keydown', event => this.handleChatEvent(event));
  }

  public notChatting() {
    return !this.texting;
  }

  private handleChatEvent(event: KeyboardEvent): void {
    if (event.key === '\\') {
      this.texting = !this.texting;
      this.toggleInputBuffer(this.texting);
    } else if (this.texting) {
      this.updateInputBuffer(event);
    }
  }

  private toggleInputBuffer(showBuffer: boolean): void {
    if (showBuffer) {
      this.showInputBuffer();
    } else {
      this.hideInputBuffer();
    }
  }

  private showInputBuffer(): void {
    this.inputText = new Text(this.scene, 1000, 500, this.inputBuffer, {fontFamily: 'gamefont', color: '#fff'})
    this.inputText.setScrollFactor(0, 0);
    this.scene.add.existing(this.inputText);
  }

  private hideInputBuffer(): void {
    this.inputText.destroy();
  }

  private updateInputBuffer(event: KeyboardEvent): void {
    console.log(event);
    if (event.key === 'Backspace') {
      this.inputBuffer = this.inputBuffer.substring(0, this.inputBuffer.length - 1);
    } else if (event.key === 'Enter') {
      // TODO: Push chat message out to the masses
    } else if (!ChatControls.ignoreKeyboardEvent(event)) {
      this.inputBuffer += event.key;
    }

    this.inputText.setText(this.inputBuffer);
  }

  private static ignoreKeyboardEvent(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.altKey || event.key === 'Shift' || event.metaKey;
  }
}
