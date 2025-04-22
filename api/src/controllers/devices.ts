import { RequestHandler } from 'express';
import Device from '../models/Device';
import { IoEvent, RecordType } from '../routes/socketEventTypes';
import { IoRoom } from '../routes/socketEvents';

export const ensureExists: RequestHandler = async (req, res, next) => {
    const { id, name, description } = req.body;
    try {
        let device = await Device.findModel(id);
        let isNew = false;

        if (!device) {
            device = await Device.createModel(id, name, description);
            isNew = true;
        }

        res.notifications = [
            {
                event: IoEvent.NEW_OR_CHANGED_RECORD,
                message: {
                    type: RecordType.Device,
                    isNew: isNew,
                    record: device,
                },
                to: [IoRoom.WEB]
            }
        ];

        res.status(200).json(device);
    } catch (error) {
        next(error);
    }
};

export const find: RequestHandler = async (req, res, next) => {
    try {
        const device = await Device.findModel(req.params.id);
        res.json(device);
    } catch (error) {
        next(error);
    }
};

export const update: RequestHandler = async (req, res, next) => {
    try {
        const model = await Device.updateModel(req.params.id, req.body);
        res.json(model);
    } catch (error) {
        next(error);
    }
};

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const removedModel = await Device.remove(req.params.id);
        res.json(removedModel);
    } catch (error) {
        next(error);
    }
};

export const all: RequestHandler = async (req, res, next) => {
    try {
        const devices = await Device.all();
        res.json(devices);
    } catch (error) {
        next(error);
    }
};
