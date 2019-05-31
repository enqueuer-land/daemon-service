import {Server} from '../server/server';

export interface Controller {
    registerRoute(server: Server): void;
}
