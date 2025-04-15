import { RequestHandler } from 'express';
import DeviceProfile from '../models/DeviceProfiles';

export const all: RequestHandler = async (req, res, next) => {
    try {
        const deviceProfiles = await DeviceProfile.all();
        res.json(deviceProfiles);
    } catch (error) {
        next(error);
    }
};

export const find: RequestHandler = async (req, res, next) => {
    try {
        const deviceProfile = await DeviceProfile.findModel(req.params.id, req.clientRole);
        res.json(deviceProfile);
    } catch (error) {
        next(error);
    }
};

export const create: RequestHandler = async (req, res, next) => {
    try {
        const { deviceId, profileId, deviceName, ledChoreoId } = req.body;
        const deviceProfile = await DeviceProfile.createModel(deviceId, profileId, deviceName, ledChoreoId);
        res.json(deviceProfile);
    } catch (error) {
        next(error);
    }
};

export const update: RequestHandler = async (req, res, next) => {
    try {
        const deviceProfile = await DeviceProfile.updateModel(req.params.id, req.body);
        res.json(deviceProfile);
    } catch (error) {
        next(error);
    }
};

export const remove: RequestHandler = async (req, res, next) => {
    try {
        const deviceProfile = await DeviceProfile.remove(req.params.id);
        res.json(deviceProfile);
    } catch (error) {
        next(error);
    }
};
