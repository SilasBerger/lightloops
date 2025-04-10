import prisma from '../src/prisma';
import { devices as devicesInput } from './seed-files/devices';

console.log('Seeding database...');

async function main() {
    const devices = await prisma.device.createMany({
        data: devicesInput,
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
