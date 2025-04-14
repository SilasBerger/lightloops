import express from 'express';
import { all as allDevices } from '../controllers/devices';

const router = express.Router();

router.get('/devices', allDevices);

export default router;
