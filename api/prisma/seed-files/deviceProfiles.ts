import { Prisma } from '@prisma/client';
import { CLAMPED_LOOP_1_DEVICE_ID, CLAMPED_LOOP_2_DEVICE_ID, ARCA_LOOP_1_DEVICE_ID } from './devices';
import { DEFAULT_PROFILE_ID, RACE_COURSE_PROFILE_ID, PRACTICE_PROFILE_ID } from './profiles';
import {
    STATIC_PINK_CHOREO_ID,
    GREEN_SINGLE_RUNNING_CHOREO_ID,
    MULTI_RUNNING_CHOREO_ID,
    MULTI_FLASHING_CHOREO_ID,
    SPLIT_MULTI_CHOREO_ID,
} from './ledChoreos';

const deviceProfiles: Prisma.DeviceProfileCreateInput[] = [
    {
        id: '7474d0d5-9331-4d6f-93e8-3c01c9052735',
        device: {
            connect: {
                id: CLAMPED_LOOP_1_DEVICE_ID,
            },
        },
        profile: {
            connect: {
                id: DEFAULT_PROFILE_ID,
            },
        },
    },
    {
        id: '08400482-080f-48f6-ad68-bcd9e16eae7a',
        device: {
            connect: {
                id: CLAMPED_LOOP_2_DEVICE_ID,
            },
        },
        profile: {
            connect: {
                id: DEFAULT_PROFILE_ID,
            },
        },
        ledChoreo: {
            connect: {
                id: STATIC_PINK_CHOREO_ID,
            },
        },
    },
    {
        id: '375b9ed2-a903-406d-943d-d8c99c8dc876',
        device: {
            connect: {
                id: ARCA_LOOP_1_DEVICE_ID,
            },
        },
        profile: {
            connect: {
                id: DEFAULT_PROFILE_ID,
            },
        },
    },
    {
        id: '9b9c3ec2-34b9-4e34-86cb-ab28699041cf',
        device: {
            connect: {
                id: CLAMPED_LOOP_1_DEVICE_ID,
            },
        },
        profile: {
            connect: {
                id: RACE_COURSE_PROFILE_ID,
            },
        },
        ledChoreo: {
            connect: {
                id: MULTI_FLASHING_CHOREO_ID,
            },
        },
    },
    {
        id: '5168dc7b-3072-4050-af9f-8cd5724c237f',
        device: {
            connect: {
                id: CLAMPED_LOOP_2_DEVICE_ID,
            },
        },
        profile: {
            connect: {
                id: RACE_COURSE_PROFILE_ID,
            },
        },
        ledChoreo: {
            connect: {
                id: GREEN_SINGLE_RUNNING_CHOREO_ID,
            },
        },
    },
    {
        id: '2219097a-68fe-4926-92cd-fe586034620e',
        device: {
            connect: {
                id: ARCA_LOOP_1_DEVICE_ID,
            },
        },
        profile: {
            connect: {
                id: RACE_COURSE_PROFILE_ID,
            },
        },
        ledChoreo: {
            connect: {
                id: SPLIT_MULTI_CHOREO_ID,
            },
        },
    },
    {
        id: '7268d180-f4fe-42c8-91e4-eed856bfb502',
        device: {
            connect: {
                id: ARCA_LOOP_1_DEVICE_ID,
            },
        },
        profile: {
            connect: {
                id: PRACTICE_PROFILE_ID,
            },
        },
        ledChoreo: {
            connect: {
                id: MULTI_RUNNING_CHOREO_ID,
            },
        },
    },
];

export { deviceProfiles };
