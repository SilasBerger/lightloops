import { Notification } from '../../routes/socketEventTypes';

// to make the file a module and avoid a TypeScript error
export {};

declare global {
    namespace Express {
        export interface Request {
            clientRole?: ClientRole;
        }
    }
}
