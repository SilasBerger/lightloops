import express from 'express';
import {
    ensureExists as ensureDeviceExists,
    find as findDevice,
    update as updateDevice,
    remove as removeDevice,
    all as allDevices,
} from '../controllers/devices';
import {
    create as createProfile,
    find as findProfile,
    update as updateProfile,
    remove as removeProfile,
    all as allProfiles,
} from '../controllers/profiles';
import {
    create as createLightScene,
    find as findLightScene,
    update as updateLightScene,
    remove as removeLightScene,
    all as allLightScenes,
} from '../controllers/lightScenes';
import {
    create as createDeviceProfile,
    find as findDeviceProfile,
    findByDeviceIdForCurrentProfile as findDeviceProfileByDeviceIdForCurrentProfile,
    update as updateDeviceProfile,
    remove as removeDeviceProfile,
    all as allDeviceProfiles,
} from '../controllers/deviceProfiles';
import { getServerState, updateServerState } from '../controllers/serverState';

const router = express.Router();

router.get('/devices', allDevices);

router.post('/device', ensureDeviceExists);
router.get('/device/:id', findDevice);
router.put('/device/:id', updateDevice);
router.delete('/device/:id', removeDevice);

router.get('/profiles', allProfiles);

router.post('/profile', createProfile);
router.get('/profile/:id', findProfile);
router.put('/profile/:id', updateProfile);
router.delete('/profile/:id', removeProfile);

router.get('/lightScenes', allLightScenes);

router.post('/lightScene', createLightScene);
router.get('/lightScene/:id', findLightScene);
router.put('/lightScene/:id', updateLightScene);
router.delete('/lightScene/:id', removeLightScene);

router.get('/deviceProfiles', allDeviceProfiles);

router.post('/deviceProfile', createDeviceProfile);
router.get('/deviceProfile/:id', findDeviceProfile);
router.get('/deviceProfile/', findDeviceProfileByDeviceIdForCurrentProfile);
router.put('/deviceProfile/:id', updateDeviceProfile);
router.delete('/deviceProfile/:id', removeDeviceProfile);

router.get('/serverState', getServerState);
router.post('/serverState', updateServerState);

export default router;
