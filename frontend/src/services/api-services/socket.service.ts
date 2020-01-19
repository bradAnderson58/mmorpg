
export class SocketService {
  private static socket: WebSocket;
  private static connected: boolean = false;

  public static createConnection(room: string, callback: (me: MessageEvent)=>void): boolean {
    this.socket = new WebSocket(`${WS_URL}ws/chat/${room}/`);
    this.socket.onopen = (event) => {
      console.log(`successfully connected: ${event}`);
      this.connected = true;
    };
    this.socket.onmessage = (event: MessageEvent) => {
      callback(event);
    };
    return true;
  }

  public static sendMessage(sender: string, message: string): boolean {
    if (this.connected) {
      this.socket.send(JSON.stringify({sender: sender, message: message}));
      return true;
    }
    return false;
  }
}