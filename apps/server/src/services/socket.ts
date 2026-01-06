import type { IncomingMessage } from "http";
import type { Duplex } from "stream";
import { Redis } from "ioredis";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";


const pub = new Redis();
const sub = new Redis();

class Socket {
    private wss: WebSocketServer;
    private roomMap: Map<WebSocket, string>;
    private SubscriptionSet = new Set<string>();
    constructor() {
        this.wss = new WebSocketServer({ noServer: true });
        this.roomMap = new Map();
        sub.on('message', (channel, message) => {
            this.broadcast(message, channel);
        })
    }
    getsocket() {
        return this.wss;
    }
    public handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
        const urlParams = new URL(request.url || "", `http://${request.headers.host}`);
        const room = urlParams.searchParams.get('room');
        this.wss.handleUpgrade(request, socket, head, (ws) => {
            if (room) this.roomMap.set(ws, room);
            this.wss.emit('connection', ws, request);

        })
    }
    private async initRedis() {
        try {
            this.roomMap.forEach(async (room) => {
                await sub.subscribe(room);
                console.log(room, "subscribing to room");
                console.log("Current Channel name", room);

            })

        } catch (error) {
            console.log("Error in redis", error);
        }
    }
    private broadcast(message: string, userChannel: string) {
        this.roomMap.forEach((channel, ws) => {
            if (channel === userChannel && ws.readyState === 1) {
                ws.send(message);
            }
        })
    }

    private async Subscribe(room: string) {
        if (this.SubscriptionSet.has(room)) return;

        await sub.subscribe(room);
        this.SubscriptionSet.add(room);
        console.log("Subscribed To room :", room);
    }
    public initlisteners() {
        const wss = this.wss;
        wss.on('connection', async (ws) => {
            const room = this.roomMap.get(ws)
            if (room) {
                await this.Subscribe(room);
            }
            ws.on('error', console.error)
            ws.on('message', async message => {
                if (!room) return;
                try {
                    console.log(room, "room from publishing");
                    await pub.publish(room, JSON.stringify({
                        message: message.toString(),
                        timeStamp: Date.now(),
                    }));
                } catch (error) {
                    console.log("Error in publishing", error);
                }

            })
            ws.on('close', async () => {
                console.log('Disconnected');
            })
        })
    }
}

export default Socket;