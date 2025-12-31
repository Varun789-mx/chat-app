import type { IncomingMessage } from "http";
import type { Duplex } from "stream";
import { WebSocketServer } from "ws";

class Socket {
    private wss: WebSocketServer;
    constructor() {
        this.wss = new WebSocketServer({ noServer: true });

    }
    allowedOrigins = ["*"]
    getsocket() {
        return this.wss;
    }
    public handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
        const origin = request.headers.origin || "";
        if (this.allowedOrigins.includes(origin)) {
            this.wss.handleUpgrade(request, socket, head, (ws) => {
                this.wss.emit('connection', ws, request);
            })
        }
    }
    public initlisteners() {
        const wss = this.wss;
        wss.on('connection', (ws) => {
            ws.on('error', console.error)
            ws.on('message', ({ message }: { message: string }) => {
                wss.clients.forEach((client) => {
                    client.send(message);
                })
            })
            ws.on('close', () => {
                console.log('Disconnected');
            })
            ws.send('Connected to websocket server')
        })
    }
}

export default Socket;