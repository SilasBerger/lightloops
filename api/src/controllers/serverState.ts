import { RequestHandler } from 'express';
import Profile from '../models/Profile';
import { serverState, updateServerState as _updateServerState } from '../serverState';
import { HTTP400Error, HTTP404Error } from '../utils/errors/Errors';

export const setCurrentProfile = (profileId: string) => {
    const profile = Profile.findModel(profileId);
    if (!profile) {
        throw new HTTP404Error(`Profile with id ${profileId} not found`);
    }

    serverState().currentProfile = profileId;
};

export const getServerState: RequestHandler = async (req, res, next) => {
    res.json(serverState());
};

export const updateServerState: RequestHandler = async (req, res, next) => {
    const update = req.body;
    if (!update) {
        throw new HTTP400Error('Invalid server settings update: No body provided');
    }

    if (update.currentProfile) {
        const profile = await Profile.findModel(update.currentProfile);
        if (!profile) {
            throw new HTTP404Error(
                `Invalid server settings update: Profile with id ${update.currentProfile} not found`
            );
        }
    }

    _updateServerState(update);
    res.json(serverState());
};
