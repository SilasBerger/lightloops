import { RequestHandler } from 'express';
import LedChoreo from '../models/LedChoreo';

export const create: RequestHandler = async (req, res, next) => {
    const { name, description, type, data } = req.body;
    try {
        const device = await LedChoreo.createModel(name, type, data, description);
        res.json(device);
    } catch (error) {
        next(error);
    }
};

export const find: RequestHandler = async (req, res, next) => {
    try {
        const device = await LedChoreo.findModel(req.params.id);
        res.json(device);
    } catch (error) {
        next(error);
    }
};

export const update: RequestHandler = async (req, res, next) => {
    try {
        const model = await LedChoreo.updateModel(req.params.id, req.body);
        res.json(model);
    } catch (error) {
        next(error);
    }
};

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const removedModel = await LedChoreo.remove(req.params.id);
        res.json(removedModel);
    } catch (error) {
        next(error);
    }
};

export const all: RequestHandler = async (req, res, next) => {
    try {
        const devices = await LedChoreo.all();
        res.json(devices);
    } catch (error) {
        next(error);
    }
};
