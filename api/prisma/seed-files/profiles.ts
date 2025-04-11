import { Prisma } from '@prisma/client';

const DEFAULT_PROFILE_ID = 'd62d26c1-2062-4b08-9faa-3f1b9513ac90';
const RACE_COURSE_PROFILE_ID = 'ab251f54-0284-4730-b8ed-8b7a4dabfffe';
const PRACTICE_PROFILE_ID = '8f43d9af-9ef6-436e-aa0d-724b7f57d9da';

const profiles: Prisma.ProfileCreateInput[] = [
    {
        id: DEFAULT_PROFILE_ID,
        name: 'Default',
        description: 'Auto-generated default profile.',
    },
    {
        id: RACE_COURSE_PROFILE_ID,
        name: 'Race Course 🏁',
        description: 'Profile for my indoor race course.',
    },
    {
        id: PRACTICE_PROFILE_ID,
        name: 'Practice',
        description: 'Minimal daily practice course.',
    },
];

export { profiles };
