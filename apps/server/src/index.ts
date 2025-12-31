import http from 'http'
import dotenv from "dotenv";
import Socket from './services/socket.js';
import { WebSocketServer } from 'ws';
import { log } from 'console';
dotenv.config();
const PORT = process.env.PORT || 8000;


async function init() {

    const SocketService = new Socket();
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end("Web socket server running");
    })

    server.on('upgrade',(request,socket,head)=> {
        SocketService.handleUpgrade(request,socket,head);
    })
    SocketService.initlisteners();
    server.listen(PORT, () => {
        console.log(`Server is running on ws://localhost:${PORT}`)
    })
}

init();
