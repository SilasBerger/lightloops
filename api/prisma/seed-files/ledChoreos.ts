import { Prisma } from '@prisma/client';

const STATIC_PINK_CHOREO_ID = 'fe7b48c0-d262-4cc9-a76c-a15101ba6ff6';
const GREEN_SINGLE_RUNNING_CHOREO_ID = '83de2318-1c29-4208-b9da-4bb39ac93da7';
const MULTI_RUNNING_CHOREO_ID = '16b52c8d-7854-4efd-81c3-93a91ab73ecf';
const COLOR_CYCLE_CHOREO_ID = '4e2caf60-fa50-47ad-a909-6a8bf99860b3';
const MULTI_FLASHING_CHOREO_ID = '16128477-e940-4e11-a029-b999e32326cc';
const SPLIT_MULTI_CHOREO_ID = 'f2fa8972-83ca-48f9-aa8f-aa13c6739288';

const ledChoreos: Prisma.LedChoreoCreateInput[] = [
    {
        id: STATIC_PINK_CHOREO_ID,
        name: 'Static pink',
        type: 'static',
        data: {
            colors: [[222, 20, 208]],
        },
    },
    {
        id: GREEN_SINGLE_RUNNING_CHOREO_ID,
        name: 'Green single running light',
        type: 'running_single',
        data: {
            color: [28, 237, 9],
        },
    },
    {
        id: MULTI_RUNNING_CHOREO_ID,
        name: 'Multi running light',
        type: 'running_multi',
        data: {},
    },
    {
        id: COLOR_CYCLE_CHOREO_ID,
        name: 'Rainbow color fade cycle 🌈',
        description: 'Fade between colors of the rainbow',
        type: 'cycle',
        data: {
            fade: true,
            durations: {
                default: 1000,
            },
            intervals: [
                {
                    colors: [[232, 20, 22]],
                    duration: 'default',
                },
                {
                    colors: [[255, 165, 0]],
                    duration: 'default',
                },
                {
                    colors: [[250, 235, 54]],
                    duration: 'default',
                },
                {
                    colors: [[121, 195, 20]],
                    duration: 'default',
                },
                {
                    colors: [[72, 125, 231]],
                    duration: 'default',
                },
                {
                    colors: [[75, 54, 157]],
                    duration: 'default',
                },
                {
                    colors: [[112, 54, 157]],
                    duration: 'default',
                },
            ],
        },
    },
    {
        id: MULTI_FLASHING_CHOREO_ID,
        name: 'Red / green flashing',
        description: 'Flash between red and blue with gaps in between',
        type: 'cycle',
        data: {
            fade: false,
            durations: {
                on: 1000,
                off: 500,
            },
            intervals: [
                {
                    colors: [[255, 0, 0]],
                    duration: 'on',
                },
                {
                    colors: [[0, 0, 0]],
                    duration: 'off',
                },
                {
                    colors: [[0, 255, 0]],
                    duration: 'on',
                },
                {
                    colors: [[0, 0, 0]],
                    duration: 'off',
                },
            ],
        },
    },
    {
        id: SPLIT_MULTI_CHOREO_ID,
        name: 'Checkered flag',
        description: 'Flash between black and white sections',
        type: 'cycle',
        data: {
            fade: false,
            durations: {
                default: 700,
                intervals: [
                    {
                        colors: [
                            [255, 255, 255],
                            [0, 0, 0],
                            [255, 255, 255],
                            [0, 0, 0],
                            [255, 255, 255],
                            [0, 0, 0],
                            [255, 255, 255],
                            [0, 0, 0],
                        ],
                        duration: 'default',
                    },
                    {
                        colors: [
                            [0, 0, 0],
                            [255, 255, 255],
                            [0, 0, 0],
                            [255, 255, 255],
                            [0, 0, 0],
                            [255, 255, 255],
                            [0, 0, 0],
                            [255, 255, 255],
                        ],
                        duration: 'default',
                    },
                ],
            },
        },
    },
];

export { ledChoreos };
