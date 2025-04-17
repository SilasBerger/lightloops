import { PrismaClient, LightScene as DbLightScene } from '@prisma/client';
import prisma from '../prisma';
import { HTTP400Error } from '../utils/errors/Errors';

function LightScene(db: PrismaClient['lightScene']) {
    return Object.assign(db, {
        async createModel(
            name: string,
            type: string,
            data: object,
            description?: string
        ): Promise<DbLightScene> {
            if (!name) {
                throw new HTTP400Error('Cannot create LightScene: name is required.');
            }
            const record = await db.findFirst({ where: { name: name } });
            if (record) {
                throw new HTTP400Error(
                    `Cannot create LightScene with name ${name}: A LightScene with this name already exists.`
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

        async all(): Promise<DbLightScene[]> {
            return db.findMany({});
        },

        async findModel(id: string): Promise<DbLightScene | null> {
            const model = await db.findUnique({
                where: {
                    id: id,
                },
            });
            return model;
        },

        async updateModel(id: string, updateData: Partial<DbLightScene>): Promise<DbLightScene> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP400Error(`Cannot update LightScene with id ${id}: No such LightScene.`);
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

        async remove(id: string): Promise<DbLightScene> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP400Error(`Cannot delete LightScene with id ${id}: No such LightScene.`);
            }

            const deletedRecord = await db.delete({ where: { id: id } });
            return deletedRecord;
        },
    });
}

export default LightScene(prisma.lightScene);
