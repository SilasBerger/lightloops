import prisma from './prisma';
import express from 'express';
import cors from 'cors';

const app = express();
export const API_VERSION = 'v1';
export const API_URL = `/api/${API_VERSION}`;

app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL ?? '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    })
);

app.use(express.json({ limit: '5mb' }));

app.get(`${API_URL}/devices`, async (req, res) => {
    const devices = await prisma.device.findMany();

    if (devices.length === 0) {
        res.status(404);
        res.send('No devices found');
        return;
    }
    res.json(devices);
});

app.get(`${API_URL}/race_course_devices`, async (req, res) => {
    const devices = await prisma.profile.findMany({
        where: {
            id: 'ab251f54-0284-4730-b8ed-8b7a4dabfffe', // Race course.
        },
        include: {
            deviceProfile: {
                select: {
                    id: true,
                    deviceName: true,
                    ledChoreo: {
                        omit: {
                            data: true,
                        }
                    },
                    device: true,
                },
            },
        },
    });

    res.json(devices);
});

export default app;
