import { Prisma, PrismaClient, Profile as DbProfile } from '@prisma/client';
import prisma from '../prisma';
import { HTTP404Error } from '../utils/errors/Errors';
import { createDataExtractor } from '../helpers/dataExtractor';

export type ApiProfile = DbProfile;

const extractUpdateData = createDataExtractor<Prisma.ProfileUncheckedUpdateInput>(['name', 'description']);

function Profile(db: PrismaClient['profile']) {
    return Object.assign(db, {
        async createModel(name: string, description?: string): Promise<DbProfile> {
            return db.create({
                data: {
                    name: name,
                    description: description,
                },
            });
        },

        async findModel(id: string): Promise<DbProfile | null> {
            const model = await db.findUnique({
                where: {
                    id: id,
                },
            });
            return model;
        },

        async updateModel(id: string, data: Partial<DbProfile>): Promise<DbProfile> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP404Error(`Cannot update profile with id ${id}: No such profile.`);
            }
            const sanitized = extractUpdateData(data, false);
            return db.update({
                where: {
                    id: id,
                },
                data: sanitized,
            });
        },

        async all(): Promise<DbProfile[]> {
            return db.findMany({});
        },

        async remove(id: string): Promise<DbProfile> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP404Error(`Cannot delete profile with id ${id}: No such profile.`);
            }

            const deletedRecord = await db.delete({ where: { id: id } });
            return deletedRecord;
        },
    });
}

export default Profile(prisma.profile);
