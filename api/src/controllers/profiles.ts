import { RequestHandler } from 'express';
import Profile from '../models/Profile';

export const create: RequestHandler = async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const profile = await Profile.createModel(name, description);
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

export const find: RequestHandler = async (req, res, next) => {
    try {
        const profile = await Profile.findModel(req.params.id);
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

export const update: RequestHandler = async (req, res, next) => {
    try {
        const model = await Profile.updateModel(req.params.id, req.body);
        res.json(model);
    } catch (error) {
        next(error);
    }
};

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const removedModel = await Profile.remove(req.params.id);
        res.json(removedModel);
    } catch (error) {
        next(error);
    }
};

export const all: RequestHandler = async (req, res, next) => {
    try {
        const profiles = await Profile.all();
        res.json(profiles);
    } catch (error) {
        next(error);
    }
};
