import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './routes/router';
import authConfig, { getClientRoleFrom } from './routes/authConfig';
import routeGuard, { createAccessRules } from './auth/guard';
import prisma from './prisma';
import { updateServerState } from './serverState';
import type { ClientToServerEvents, ServerToClientEvents } from './routes/socketEventTypes';
import type { Server } from 'socket.io';
import Logger from './utils/logger';

const app = express();
export const API_VERSION = 'v1';
export const API_URL = `/api/${API_VERSION}`;

const AccessRules = createAccessRules(authConfig.accessMatrix);

app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL ?? '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    })
);

app.use(express.json({ limit: '5mb' }));

// TODO: Consider supporting a clientId header for web client instance identification -> improved support for toSelf: false on io events.
const extractClientRole = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const authHeaderParts = (authHeader && authHeader.split(' ')) || [];
    authHeaderParts.shift();
    const apiKey = authHeaderParts.join(' ');

    req.clientRole = getClientRoleFrom(apiKey);

    next();
};

// TODO: Consider persisting state to DB to avoid reset on restart.
const loadDefaultServerState = async () => {
    const profile = await prisma.profile.findFirst({});
    const profileId = profile ? profile.id : null;
    updateServerState({
        currentProfile: profileId ?? '',
    });
};

export const configure = (_app: typeof app) => {
    _app.use((req: Request, res: Response, next: NextFunction) => {
        res.on('finish', async () => {
            if (res.statusCode >= 400) {
                return;
            }
            const io = req.io as Server<ClientToServerEvents, ServerToClientEvents>;

            if (res.notifications && io) {
                res.notifications.forEach((notification) => {
                    Logger.info(notification);
                    const except: string[] = [];
                    /** ignore this socket */
                    if (!notification.toSelf) {
                        const socketID = req.headers['x-metadata-socketid'] as string;
                        if (socketID) {
                            except.push(socketID);
                        }
                    }
                    io.except(except)
                        .to(notification.to)
                        .emit(notification.event, notification.message as any);
                });
            }
        });
        next();
    });

    _app.use(
        API_URL,
        extractClientRole, // middleware to extract client role from auth header
        routeGuard(AccessRules),
        router
    );

    loadDefaultServerState().then();
};

export default app;
