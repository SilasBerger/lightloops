import {
    PrismaClient,
    DeviceProfile as DbDeviceProfile,
    Device as DbDevice,
    LedChoreo as DbLedChoreo,
    Prisma,
} from '@prisma/client';
import { HTTP400Error, HTTP404Error } from '../utils/errors/Errors';
import prisma from '../prisma';
import { createDataExtractor } from '../helpers/dataExtractor';
import { ClientRole } from '../routes/authConfig';
import Logger from '../utils/logger';

const extractUpdateData = createDataExtractor<Prisma.DeviceProfileUncheckedUpdateInput>([
    'deviceName',
    'ledChoreoId',
]);

interface WebApiDeviceProfile {
    id: string;
    device: DbDevice;
    profileId: string;
    deviceName: string | null;
    ledChoreo: DbLedChoreo | null;
}

interface DeviceApiDeviceProfile {
    ledChoreo: DbLedChoreo | null;
}

function DeviceProfiles(db: PrismaClient['deviceProfile']) {
    return Object.assign(db, {
        async all(): Promise<WebApiDeviceProfile[]> {
            const deviceProfiles = await db.findMany({
                select: {
                    id: true,
                    deviceName: true,
                    device: true,
                    profileId: true,
                    ledChoreo: true,
                },
            });
            return deviceProfiles;
        },

        async findModel(
            id: string,
            clientRole: ClientRole
        ): Promise<WebApiDeviceProfile | DeviceApiDeviceProfile | null> {
            const select =
                clientRole === ClientRole.DEVICE
                    ? {
                          ledChoreo: true,
                      }
                    : {
                          id: true,
                          deviceName: true,
                          device: true,
                          profileId: true,
                          ledChoreo: true,
                      };

            const deviceProfile = await db.findUnique({
                where: {
                    id: id,
                },
                select: select,
            });
            return deviceProfile;
        },

        async findByDeviceAndProfileId(
            deviceId: string,
            profileId: string,
            clientRole: ClientRole
        ): Promise<WebApiDeviceProfile | DeviceApiDeviceProfile | null> {
            const select =
                clientRole === ClientRole.DEVICE
                    ? {
                          ledChoreo: true,
                      }
                    : {
                          id: true,
                          deviceName: true,
                          device: true,
                          profileId: true,
                          ledChoreo: true,
                      };
            const deviceProfile = await db.findFirst({
                where: {
                    deviceId: deviceId,
                    profileId: profileId,
                },
                select: select,
            });
            return deviceProfile;
        },

        async createModel(
            deviceId: string,
            profileId: string,
            deviceName?: string,
            ledChoreoId?: string
        ): Promise<WebApiDeviceProfile> {
            const profile = await prisma.profile.findUnique({ where: { id: profileId } });
            if (!profile) {
                throw new HTTP404Error(`Cannot create device profile: No such profile with id ${profileId}.`);
            }

            const device = await prisma.device.findUnique({ where: { id: deviceId } });
            if (!device) {
                throw new HTTP404Error(`Cannot create device profile: No such device with id ${deviceId}.`);
            }

            const deviceProfile = await db.findFirst({ where: { deviceId: deviceId, profileId: profileId } });
            if (deviceProfile) {
                throw new HTTP400Error(
                    `Cannot create device profile: A device profile for device '${device.name}' (${deviceId}) in profile '${profile.name}' (${profileId}) already exists.`
                );
            }

            const createdDeviceProfile = await db.create({
                data: {
                    deviceId: deviceId,
                    profileId: profileId,
                    deviceName: deviceName,
                    ledChoreoId: ledChoreoId,
                },
                select: {
                    id: true,
                    deviceName: true,
                    device: true,
                    profileId: true,
                    ledChoreo: true,
                },
            });
            return createdDeviceProfile;
        },

        async updateModel(id: string, data: Partial<DbDeviceProfile>): Promise<WebApiDeviceProfile> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP404Error(`Cannot update device profile with id ${id}: No such device profile.`);
            }

            const sanitized = extractUpdateData(data, false);
            const updatedRecord = await db.update({
                where: { id: id },
                data: sanitized,
                select: {
                    id: true,
                    deviceName: true,
                    device: true,
                    profileId: true,
                    ledChoreo: true,
                },
            });
            return updatedRecord;
        },

        async remove(id: string): Promise<DbDeviceProfile> {
            const record = await db.findUnique({ where: { id: id } });
            if (!record) {
                throw new HTTP404Error(`Cannot delete device profile with id ${id}: No such device profile.`);
            }

            const deletedRecord = await db.delete({ where: { id: id } });
            return deletedRecord;
        },
    });
}

export default DeviceProfiles(prisma.deviceProfile);
