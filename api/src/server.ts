import app from './app';
import Logger from './utils/logger';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import expressWs, { Application } from 'express-ws';
import WebSocket from 'ws';
import prisma from './prisma';

const PORT = process.env.PORT || 3002;
const APP_URI = new URL(process.env.APP_DOMAIN || `http://localhost`);
const DEVICE_API_KEY = process.env.DEVICE_API_KEY || '';
APP_URI.port = `${PORT}`;
const WS_URI = `ws://${APP_URI.host}/ws`;
const server = http.createServer(app);

// Initialize express-ws for raw WebSocket support
expressWs(app, server); // Initialize express-ws

const io = new SocketIOServer(server, {
    cors: {
        // TODO: Duplicate – factor out.
        origin: process.env.FRONTEND_URL ?? '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    // TODO: Reject unless valid API key is provided.
    Logger.info(`WebUI connected: ${socket.id}`);

    // TODO: Remove this.
    socket.on('message', (message) => {
        Logger.info({ event: 'Socket.io message', data: message });
    });

    socket.on('disconnect', () => {
        Logger.info(`WebUI disconnected: ${socket.id}`);
    });
});

const rejectWsConnection = (msg: string, ws: WebSocket.WebSocket) => {
    Logger.info(msg);
    ws.send(JSON.stringify({event: 'error', data: msg}))
    ws.close();
}

(app as unknown as Application).ws('/ws', async (ws, req) => {
    Logger.info('New WebSocket connection established');
    
    const apiKey = req.query['apiKey']
    if (apiKey !== DEVICE_API_KEY) {
        rejectWsConnection('Rejecting WebSocket connection: either no apiKey provided in query params, or key does not match DEVICE_API_KEY.', ws);
        return;
    }

    const deviceId = req.query['deviceId']
    if (!deviceId) {
        rejectWsConnection('Rejecting WebSocket connection: no deviceId provided in query params.', ws);
        return;
    }

    const device = await prisma.device.findUnique({ where: { id: deviceId as string } });
    if (!device) {
        rejectWsConnection(`Rejecting WebSocket connection: No registered device with id '${deviceId}'.`, ws);
        return;
    }

    ws.on('message', (message) => {
        Logger.info({ event: 'Raw WebSocket message', data: message });
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        Logger.info('WebSocket connection closed');
    });
});

server.listen(PORT, () => {
    Logger.info(`Application is running at: http://localhost:${PORT}.`);
    Logger.info(`WebSocket endpoints:`);
    Logger.info(`- WebUI: ${APP_URI} (Socket.io)`);
    Logger.info(`- Devices: ${WS_URI}`);
});
