import { RequestHandler } from 'express';
import LightScene from '../models/LightScene';

export const create: RequestHandler = async (req, res, next) => {
    const { name, description, type, data } = req.body;
    try {
        const device = await LightScene.createModel(name, type, data, description);
        res.json(device);
    } catch (error) {
        next(error);
    }
};

export const find: RequestHandler = async (req, res, next) => {
    try {
        const device = await LightScene.findModel(req.params.id);
        res.json(device);
    } catch (error) {
        next(error);
    }
};

export const update: RequestHandler = async (req, res, next) => {
    try {
        const model = await LightScene.updateModel(req.params.id, req.body);
        res.json(model);
    } catch (error) {
        next(error);
    }
};

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const removedModel = await LightScene.remove(req.params.id);
        res.json(removedModel);
    } catch (error) {
        next(error);
    }
};

export const all: RequestHandler = async (req, res, next) => {
    try {
        const devices = await LightScene.all();
        res.json(devices);
    } catch (error) {
        next(error);
    }
};
