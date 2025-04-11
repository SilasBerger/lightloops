import prisma from '../src/prisma';
import { devices as devicesInput } from './seed-files/devices';
import { profiles as profilesInput } from './seed-files/profiles';
import { ledChoreos as ledChoreosInput } from './seed-files/ledChoreos';

async function main() {
    const devices = await prisma.device.createMany({
        data: devicesInput,
    });

    const profiles = await prisma.profile.createMany({
        data: profilesInput,
    });

    const ledChoreos = await prisma.ledChoreo.createMany({
        data: ledChoreosInput,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
