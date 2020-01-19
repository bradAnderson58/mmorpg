import * as _ from 'lodash';
import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;
import {SocketService} from "./api-services/socket.service";

export class ChatControls {
  private readonly scene: Scene;
  private inputBuffer: string = '...';
  private inputText: Text;
  private logText: Text;
  private texting: boolean = false;
  private chatLog: string[] = [];
  private readonly name: string;

  constructor(scene: Scene, name: string) {
    this.scene = scene;
    this.name = name;

    this.logText = new Text(this.scene, 1000, 300, this.chatLog, {fontFamily: 'gamefont', color: '#fff'});
    this.logText.setScrollFactor(0, 0);
    this.scene.add.existing(this.logText);

    SocketService.createConnection('test', (event) => this.handleMessageEvent(event));
    scene.input.keyboard.on('keydown', event => this.handleChatEvent(event));
  }

  public notChatting() {
    return !this.texting;
  }

  private handleChatEvent(event: KeyboardEvent): void {
    if (ChatControls.isToggleControl(event)) {
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
    this.inputText = new Text(this.scene, 1000, 500, this.inputBuffer, {fontFamily: 'gamefont', color: '#fff'});
    this.inputText.setScrollFactor(0, 0);
    this.scene.add.existing(this.inputText);
  }

  private hideInputBuffer(): void {
    this.inputText.destroy();
  }

  private updateInputBuffer(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.inputBuffer = this.inputBuffer.substring(0, this.inputBuffer.length - 1);
    } else if (event.key === 'Enter') {
      SocketService.sendMessage(this.name, this.inputBuffer);
      this.inputBuffer = '';
    } else if (!ChatControls.ignoreKeyboardEvent(event)) {
      this.inputBuffer += event.key;
    }

    this.inputText.setText(this.inputBuffer);
  }

  private handleMessageEvent(event: MessageEvent): void {
    const payload = JSON.parse(event.data);
    const logItem = `${payload.sender}: ${payload.message}`;
    this.chatLog = _.concat(this.chatLog, logItem);
    if (this.chatLog.length >= 5) {
      this.chatLog = _.drop(this.chatLog);
    }
    this.logText.setText(this.chatLog);
  }

  private static ignoreKeyboardEvent(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.altKey || event.key === 'Shift' || event.metaKey || event.key === 'Tab';
  }

  private static isToggleControl(event: KeyboardEvent): boolean {
    return (event.key === 'Control' && event.shiftKey) || (event.key === 'Shift' && event.ctrlKey);
  }
}
