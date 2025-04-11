import app from './app';
import Logger from './utils/logger';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import expressWs from 'express-ws';

const PORT = process.env.PORT || 3002;
const server = http.createServer(app);

// Initialize express-ws for raw WebSocket support
expressWs(app, server);  // Initialize express-ws

const io = new SocketIOServer(server, {
    cors: {
        // TODO: Duplicate – factor out.
        origin: process.env.FRONTEND_URL ?? '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // TODO: Reject unless valid API key is provided.
    Logger.info(`WebUI connected: ${socket.id}`);

    // TODO: Remove this.
    socket.on('message', (message) =>  {
        Logger.info({event: 'Socket.io message', data: message});
    });

    socket.on('disconnect', () => {
        Logger.info(`WebUI disconnected: ${socket.id}`);
    });
});

// TODO: Fix typing.
(app as any).ws('/ws', (ws: any, req: any) => {
    Logger.info('New WebSocket connection established');

    ws.on('message', (message: any) => {
        Logger.info({event: 'Raw WebSocket message', data: message});
        
        // Echo message back to client
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        Logger.info('WebSocket connection closed');
    });
});

server.listen(PORT, () => {
    Logger.info(`Application is running at: http://localhost:${PORT}.`);
    Logger.info(`WebSocket endpoints:`);
    Logger.info(`- WebUI: http://localhost:${PORT} (Socket.io)`);
    Logger.info(`- Devices: ws://localhost:${PORT}/ws`); // TODO: Factor out path.
});
