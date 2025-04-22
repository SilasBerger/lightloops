import { Server, Socket } from 'socket.io';
import Logger from '../utils/logger';
import { ClientToServerEvents, ServerToClientEvents } from './socketEventTypes';
import prisma from '../prisma';
import { ClientRole, getClientRoleFrom } from './authConfig';

export enum IoRoom {
    WEB = 'web',
    DEVICE = 'device',
    ALL = 'all',
}

interface SocketRequestInfo { 
    deviceId?: string,
    clientRole?: ClientRole
}

const extractSocketRequestInfo: (socket: Socket) => SocketRequestInfo = (socket: Socket) => {
    const query = (socket.request as any)?._query || {};
    const clientRole = getClientRoleFrom(query['apiKey']);
    const deviceId = query['deviceId'];
    return {clientRole, deviceId};
};

const EventRouter = (io: Server<ClientToServerEvents, ServerToClientEvents>) => {
    io.on('connection', async (socket) => {
        Logger.info('Processing Socket.io connection attempt.');
        const { deviceId, clientRole } = extractSocketRequestInfo(socket);

        if (clientRole == ClientRole.WEB) {
            socket.join(IoRoom.WEB);
        } else if (clientRole == ClientRole.DEVICE) {
            if (!deviceId) {
                Logger.info('Device Socket.io request did not provide a valid device ID: disconnecting.');
                return socket.disconnect();
            }

            prisma.device.findUnique({ where: { id: deviceId } });
            if (!deviceId) {
                Logger.info('Device Socket.io request provided a device ID for an unregistered device: disconnecting.');
                return socket.disconnect();
            }

            socket.join(deviceId);
        } else {
            Logger.info('Socket.io request did not provide a valid API key: disconnecting.');
            return socket.disconnect();
        }

        socket.join(IoRoom.ALL);
        Logger.info(`Socket with id ${socket.id} and clientRole '${clientRole}' (deviceId: ${deviceId}) connected.`)
    });

    io.on('disconnect', (socket) => {
        const { clientRole, deviceId } = socket.request as SocketRequestInfo;
        if (clientRole == ClientRole.WEB) {
            Logger.info('Socket.io web client disconnected.');
        } else {
            Logger.info(`Socket.io device client (deviceId: '${deviceId}') disconnected.`);
        }
    });

    io.on('error', (socket) => {
        Logger.error(`Socket.io error`);
    });

    io.on('reconnect', (socket) => {
        const { clientRole, deviceId } = socket.request as SocketRequestInfo;
        if (clientRole == ClientRole.WEB) {
            Logger.info('Socket.io web client reconnected.');
        } else {
            Logger.info(`Socket.io device client (deviceId: '${deviceId}') reconnected.`);
        }
    });
}

export default EventRouter;
