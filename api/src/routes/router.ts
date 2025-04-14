import express from 'express';
import { find as findDevice, update as updateDevice, remove as removeDevice, all as allDevices } from '../controllers/devices';

const router = express.Router();

router.get('/devices', allDevices);

router.get('/device/:id', findDevice);
router.put('/device/:id', updateDevice);
router.delete('/device/:id', removeDevice);

export default router;
