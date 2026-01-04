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
        this.initRedis();
    }
    getsocket() {
        return this.wss;
    }
    public handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
        const origin = request.headers.origin || "";
        this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.wss.emit('connection', ws, request);
        })
    }
    private async initRedis() {
        try {
            await sub.subscribe("Messages");
            sub.on('message', (message) => {
                this.broadcast(message);
            })
        } catch (error) {
            console.log("Error in redis", error);
        }
    }
    private broadcast(message: string) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(message);
            }
        })
    }
    public initlisteners() {
        const wss = this.wss;
        wss.on('connection', (ws) => {
            console.log("ws");
            ws.on('error', console.error)
            ws.on('message', async message => {
                try {
                    console.log("Message in publishing", message);
                    await pub.publish("Messages", JSON.stringify({
                        message: message.toString(),
                        timeStamp: Date.now(),
                    }))
                } catch (error) {
                    console.log("Error in publishing", error);
                }
            })
            ws.on('close', async () => {
                console.log('Disconnected');
                ws.close();
            })
            ws.send('Connected to websocket server')
        })
    }
}

export default Socket;