import { RequestHandler } from 'express';
import Device from '../models/Device';

export const all: RequestHandler = async (req, res, next) => {
    try {
        const devices = await Device.all();
        res.json(devices);
    } catch (error) {
        next(error);
    }
};
