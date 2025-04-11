import app from './app';
import Logger from './utils/logger';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const PORT = process.env.PORT || 3002;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
    cors: {
        // TODO: Duplicate – factor out.
        origin: process.env.FRONTEND_URL ?? '*',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // TODO: Reject unless API key is provided.
    Logger.info(`WebUI connected: ${socket.id}`);

    // TODO: Remove this.
    socket.on('message', (message) =>  {
        Logger.info({event: 'socket.io message', data: message});
    });

    socket.on('disconnect', () => {
        Logger.info(`WebUI disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    Logger.info(`Application is running at: http://localhost:${PORT}.`);
    Logger.info(`WebSocket endpoints:`);
    Logger.info(`- WebUI: http://localhost:${PORT} (Socket.io)`);
});
