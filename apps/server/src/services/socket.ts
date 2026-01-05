import type { IncomingMessage } from "http";
import type { Duplex } from "stream";
import { Redis } from "ioredis";
import { WebSocketServer } from "ws";


const pub = new Redis();
const sub = new Redis();

class Socket {
    private wss: WebSocketServer;
    public roomId: string;
    constructor() {
        this.wss = new WebSocketServer({ noServer: true });
        this.initRedis();
        this.roomId = '';
    }
    getsocket() {
        return this.wss;
    }
    public handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
        const urlParams = new URL(request.url || "", `http://${request.headers.host}`);
        const room = urlParams.searchParams.get('room');
        if (room) this.roomId = room;
        this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.wss.emit('connection', ws, request);
        })
    }
    private async initRedis() {
        try {
            await sub.subscribe(this.roomId);
            console.log("Current Channel name", this.roomId);
            sub.on('message', (channel, message) => {
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
        wss.on('connection', (ws, req) => {
            ws.on('error', console.error)
            ws.on('message', async message => {
                try {
                    console.log("Message in publishing", message.toString());
                    await pub.publish(this.roomId, JSON.stringify({
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
        })
    }
}

export default Socket;