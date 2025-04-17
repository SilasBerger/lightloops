// Reference: https://github.com/GBSL-Informatik/teaching-api/blob/main/src/routes/authConfig.ts

interface Credentials {
    webApiKey: string;
    deviceApiKey: string;
}

export enum ClientRole {
    WEB = 'web',
    DEVICE = 'device',
}

export interface AccessMatrix {
    [key: string]: {
        path: string;
        access: {
            methods: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
            clientRoles: ClientRole[];
        }[];
    };
}

interface Config {
    credentials: Credentials;
    accessMatrix: AccessMatrix;
}

/**
 * Routes that are accessible without authentication
 * only for GET requests, e.g. ['/public']
 */
export const PUBLIC_ROUTES: string[] = [];

const authConfig: Config = {
    credentials: {
        webApiKey: process.env.WEB_API_KEY || '',
        deviceApiKey: process.env.DEVICE_API_KEY || '',
    },
    accessMatrix: {
        devices: {
            path: '/devices',
            access: [
                {
                    methods: ['GET'],
                    clientRoles: [ClientRole.WEB],
                },
            ],
        },
        device: {
            path: '/device',
            access: [
                {
                    methods: ['GET', 'PUT', 'DELETE'],
                    clientRoles: [ClientRole.WEB],
                },
                {
                    methods: ['POST'],
                    clientRoles: [ClientRole.DEVICE],
                },
            ],
        },
        profiles: {
            path: '/profiles',
            access: [
                {
                    methods: ['GET'],
                    clientRoles: [ClientRole.WEB],
                },
            ],
        },
        profile: {
            path: '/profile',
            access: [
                {
                    methods: ['GET', 'POST', 'PUT', 'DELETE'],
                    clientRoles: [ClientRole.WEB],
                },
            ],
        },
        ledChoreos: {
            path: '/ledChoreos',
            access: [
                {
                    methods: ['GET'],
                    clientRoles: [ClientRole.WEB],
                },
            ],
        },
        ledChoreo: {
            path: '/ledChoreo',
            access: [
                {
                    methods: ['GET'],
                    clientRoles: [ClientRole.WEB, ClientRole.DEVICE],
                },
                {
                    methods: ['POST', 'PUT', 'DELETE'],
                    clientRoles: [ClientRole.WEB],
                },
            ],
        },
        deviceProfiles: {
            path: '/deviceProfiles',
            access: [
                {
                    methods: ['GET'],
                    clientRoles: [ClientRole.WEB],
                },
            ],
        },
        deviceProfile: {
            path: '/deviceProfile',
            access: [
                {
                    methods: ['GET'],
                    clientRoles: [ClientRole.WEB, ClientRole.DEVICE],
                },
                {
                    methods: ['POST', 'PUT', 'DELETE'],
                    clientRoles: [ClientRole.WEB],
                },
            ],
        },
        settings: {
            path: '/serverState',
            access: [
                {
                    methods: ['GET', 'POST'],
                    clientRoles: [ClientRole.WEB],
                },
            ]
        }
    },
};

export default authConfig;
