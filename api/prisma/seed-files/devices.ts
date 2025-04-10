import { Prisma } from '@prisma/client';

export const CLAMPED_LOOP_1_DEVICE_ID = '09756982-154d-43f9-bffa-c820b3a8e1fe';
export const CLAMPED_LOOP_2_DEVICE_ID = '5d333842-1d01-410c-a311-2ce1fa6e06a3';
export const ARCA_LOOP_1_DEVICE_ID = '205e8dce-13f7-49ef-9c61-e612b3cc80b6';

const devices: Prisma.DeviceCreateInput[] = [
    {
        id: CLAMPED_LOOP_1_DEVICE_ID,
        name: 'Clamped Loop 1',
    },
    {
        id: CLAMPED_LOOP_2_DEVICE_ID,
        name: 'Clamped Loop 2',
    },
    {
        id: ARCA_LOOP_1_DEVICE_ID,
        name: 'Arca Loop 1',
        description: 'Loop mounted to GorillaPod',
    },
];

export { devices };
