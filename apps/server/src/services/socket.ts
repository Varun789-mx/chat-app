import type { IncomingMessage } from "http";
import type { Duplex } from "stream";
import { Redis } from "ioredis";
import { WebSocketServer } from "ws";


const pub = new Redis();
const sub = new Redis();

class Socket {
    private wss: WebSocketServer;
    constructor() {
        this.wss = new WebSocketServer({ noServer: true });

    }
    getsocket() {
        return this.wss;
    }
    public handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
        console.log("Handle upgrade working")
        const origin = request.headers.origin || "";
        this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.wss.emit('connection', ws, request);
        })
    }

    public initlisteners() {
      
        const wss = this.wss;
        wss.on('connection', (ws) => {
            console.log("ws");
            ws.on('error', console.error)
            ws.on('message', message => {
                wss.clients.forEach(async (client) => {
                      await pub.connect();
                    console.log("server received : ", message.toString());
                    await pub.publish("Messages", JSON.stringify({ message }));
                })
            })
            ws.on('close', () => {
                console.log('Disconnected');
                ws.close();
            })
            ws.send('Connected to websocket server')
        })
    }
}

export default Socket;