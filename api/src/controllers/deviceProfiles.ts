import { RequestHandler } from 'express';
import DeviceProfile from '../models/DeviceProfiles';
import Logger from '../utils/logger';

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

export const findByDeviceIdForCurrentProfile: RequestHandler = async (req, res, next) => {
    try {
        // TODO: Just for development.
        const currentProfileId = 'ab251f54-0284-4730-b8ed-8b7a4dabfffe';
        const deviceId = req.query['deviceId'] as string;
        const deviceProfile = await DeviceProfile.findByDeviceAndProfileId(
            deviceId,
            currentProfileId,
            req.clientRole
        );
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
