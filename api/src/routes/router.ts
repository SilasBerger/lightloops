import express from 'express';
import {
    create as createDevice,
    find as findDevice,
    update as updateDevice,
    remove as removeDevice,
    all as allDevices,
} from '../controllers/devices';
import {
    create as createProfiles,
    find as findProfiles,
    update as updateProfiles,
    remove as removeProfiles,
    all as allProfiles,
} from '../controllers/profiles';

const router = express.Router();

router.get('/devices', allDevices);

router.post('/device', createDevice);
router.get('/device/:id', findDevice);
router.put('/device/:id', updateDevice);
router.delete('/device/:id', removeDevice);

router.get('/profiles', allProfiles);

router.post('/profile', createProfiles);
router.get('/profile/:id', findProfiles);
router.put('/profile/:id', updateProfiles);
router.delete('/profile/:id', removeProfiles);

export default router;
