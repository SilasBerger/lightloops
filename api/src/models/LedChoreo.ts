import { PrismaClient, LedChoreo as DbLedChoreo } from '@prisma/client';
import prisma from '../prisma';
import { HTTP400Error } from '../utils/errors/Errors';

function LedChoreo(db: PrismaClient['ledChoreo']) {
    return Object.assign(db, {
        async createModel(
            name: string,
            type: string,
            data: object,
            description?: string
        ): Promise<DbLedChoreo> {
            if (!name) {
                throw new HTTP400Error('Cannot create LedChoreo: name is required.');
            }
            const record = await db.findFirst({ where: { name: name } });
            if (record) {
                throw new HTTP400Error(
                    `Cannot create LedChoreo with name ${name}: A LedChoreo with this name already exists.`
                );
            }

            return db.create({
                data: {
                    name,
                    description,
                    type,
                    data,
                },
            });
        },

        async all(): Promise<DbLedChoreo[]> {
            return db.findMany({});
        },

        async findModel(id: string): Promise<DbLedChoreo | null> {
            const model = await db.findUnique({
                where: {
                    id: id,
                },
            });
            return model;
        },

        async updateModel(id: string, updateData: Partial<DbLedChoreo>): Promise<DbLedChoreo> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP400Error(`Cannot update LedChoreo with id ${id}: No such LedChoreo.`);
            }
            const { name, description, type, data } = updateData;
            return db.update({
                where: {
                    id: id,
                },
                data: {
                    name,
                    description,
                    type,
                    data: data ?? undefined,
                },
            });
        },

        async remove(id: string): Promise<DbLedChoreo> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP400Error(`Cannot delete LedChoreo with id ${id}: No such LedChoreo.`);
            }

            const deletedRecord = await db.delete({ where: { id: id } });
            return deletedRecord;
        },
    });
}

export default LedChoreo(prisma.ledChoreo);
