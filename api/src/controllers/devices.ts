import { RequestHandler } from 'express';
import Device from '../models/Device';

export const find: RequestHandler = async (req, res, next) => {
    try {
        const device = await Device.findModel(req.params.id);
        res.json(device);
    } catch (error) {
        next(error);
    }
}

export const update: RequestHandler = async (req, res, next) => { 
    try {
        const model = await Device.updateModel(req.params.id, req.body);
        res.json(model);
    } catch (error) {
        next(error);
    } 
}

export const remove: RequestHandler = async(req, res, next) => {
    try {
        const removedModel = await Device.remove(req.params.id);
        res.json(removedModel)
    } catch (error) {
        next(error)
    }
}

export const all: RequestHandler = async (req, res, next) => {
    try {
        const devices = await Device.all();
        res.json(devices);
    } catch (error) {
        next(error);
    }
};
