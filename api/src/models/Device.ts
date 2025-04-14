import { Prisma, PrismaClient, Device as DbDevice } from '@prisma/client';
import prisma from '../prisma';
import { HTTP404Error } from '../utils/errors/Errors';
import { createDataExtractor } from '../helpers/dataExtractor';

const extractUpdateData = createDataExtractor<Prisma.DeviceUncheckedUpdateInput>(['name', 'description']);

function Device(db: PrismaClient['device']) {
    return Object.assign(db, {
        async createModel(id: string, name: string, description?: string): Promise<DbDevice> {
            return db.create({
                data: {
                    id: id,
                    name: name,
                    description: description,
                },
            });
        },

        async findModel(id: string): Promise<DbDevice | null> {
            const model = await db.findUnique({
                where: {
                    id: id,
                },
            });
            return model;
        },

        async updateModel(id: string, data: Partial<DbDevice>): Promise<DbDevice> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP404Error(`Cannot update device with id ${id}: No such device.`);
            }
            const sanitized = extractUpdateData(data, false);
            return db.update({
                where: {
                    id: id,
                },
                data: sanitized,
            });
        },

        async all(): Promise<DbDevice[]> {
            return db.findMany({});
        },

        async remove(id: string): Promise<DbDevice> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP404Error(`Cannot delete device with id ${id}: No such device.`);
            }

            const deletedRecord = await db.delete({ where: { id: id } });
            return record;
        },
    });
}

export default Device(prisma.device);
