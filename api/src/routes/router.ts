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
    create as createLedChoreo,
    find as findLedChoreo,
    update as updateLedChoreo,
    remove as removeLedChoreo,
    all as allLedChoreos,
} from '../controllers/ledChoreos';
import {
    create as createDeviceProfile,
    find as findDeviceProfile,
    findByDeviceIdForCurrentProfile as findDeviceProfileByDeviceIdForCurrentProfile,
    update as updateDeviceProfile,
    remove as removeDeviceProfile,
    all as allDeviceProfiles,
} from '../controllers/deviceProfiles';

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

router.get('/ledChoreos', allLedChoreos);

router.post('/ledChoreo', createLedChoreo);
router.get('/ledChoreo/:id', findLedChoreo);
router.put('/ledChoreo/:id', updateLedChoreo);
router.delete('/ledChoreo/:id', removeLedChoreo);

router.get('/deviceProfiles', allDeviceProfiles);

router.post('/deviceProfile', createDeviceProfile);
router.get('/deviceProfile/:id', findDeviceProfile);
router.get('/deviceProfile/', findDeviceProfileByDeviceIdForCurrentProfile);
router.put('/deviceProfile/:id', updateDeviceProfile);
router.delete('/deviceProfile/:id', removeDeviceProfile);

export default router;
