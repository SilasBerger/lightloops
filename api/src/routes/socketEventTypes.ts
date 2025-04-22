import { ApiDevice } from "../models/Device";
import { WebApiDeviceProfile } from "../models/DeviceProfiles";
import { ApiLightScene } from "../models/LightScene";
import { ApiProfile } from "../models/Profile";

export enum IoEvent {
    NEW_RECORD = 'NEW_RECORD',
    CHANGED_RECORD = 'CHANGED_RECORD',
    DELETED_RECORD = 'DELETED_RECORD',
    CONNECTED_CLIENTS = 'CONNECTED_CLIENTS'
}

export enum RecordType {
    Device = 'Document',
    Profile = "Profile",
    LightScene = "LightScene",
    DeviceProfile = "DeviceProfile",
}

type TypeRecordMap = {
    [RecordType.Device]: ApiDevice;
    [RecordType.Profile]: ApiProfile;
    [RecordType.LightScene]: ApiLightScene;
    [RecordType.DeviceProfile]: WebApiDeviceProfile;
};

export interface NewRecord<T extends RecordType> {
    type: T;
    record: TypeRecordMap[T];
}

export interface ChangedRecord<T extends RecordType> {
    type: T;
    record: TypeRecordMap[T];
}

export interface ConnectedClients {
    rooms: [string, number][];
    type: 'full' | 'update';
}

export interface DeletedRecord {
    type: RecordType;
    id: string;
}

interface NotificationBase {
    to: string | string[];
    toSelf?: true | boolean;
}

interface NotificationNewRecord extends NotificationBase {
    event: IoEvent.NEW_RECORD;
    message: NewRecord<RecordType>;
}

interface NotificationChangedRecord extends NotificationBase {
    event: IoEvent.CHANGED_RECORD;
    message: ChangedRecord<RecordType>;
}

interface NotificationDeletedRecord extends NotificationBase {
    event: IoEvent.DELETED_RECORD;
    message: DeletedRecord;
}

export type Notification =
    | NotificationNewRecord
    | NotificationChangedRecord
    | NotificationDeletedRecord

/**
 * client side initiated events
 */
export enum IoClientEvent {
    JOIN_ROOM = 'JOIN_ROOM',
    LEAVE_ROOM = 'LEAVE_ROOM'
}

export type ServerToClientEvents = {
    [IoEvent.NEW_RECORD]: (message: NewRecord<RecordType>) => void;
    [IoEvent.CHANGED_RECORD]: (message: ChangedRecord<RecordType>) => void;
    [IoEvent.DELETED_RECORD]: (message: DeletedRecord) => void;
    [IoEvent.CONNECTED_CLIENTS]: (message: ConnectedClients) => void;
};

export interface ClientToServerEvents {
    [IoClientEvent.JOIN_ROOM]: (roomId: string, callback: () => void) => void;
    [IoClientEvent.LEAVE_ROOM]: (roomId: string, callback: () => void) => void;
}
