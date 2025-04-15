import express, { Handler, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './routes/router';
import authConfig, { ClientRole } from './routes/authConfig';
import routeGuard, { createAccessRules } from './auth/guard';

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

const extractClientRole = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const authHeaderParts = (authHeader && authHeader.split(' ')) || [];
    authHeaderParts.shift();
    const apiKey = authHeaderParts.join(' ');

    if (apiKey === authConfig.credentials.webApiKey) {
        req.clientRole = ClientRole.WEB;
    } else if (apiKey === authConfig.credentials.deviceApiKey) {
        req.clientRole = ClientRole.DEVICE;
    } else {
        req.clientRole = undefined;
    }

    next();
};

app.use(
    API_URL,
    extractClientRole, // middleware to extract client role from auth header
    routeGuard(AccessRules),
    router
);

export default app;
