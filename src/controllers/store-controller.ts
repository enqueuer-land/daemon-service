import {Controller} from './controller';
import {Store} from 'enqueuer';
import {Server} from '../server/server';

export class StoreController implements Controller {

    public registerRoute(server: Server): void {
        server.getApplication()
            .get('/store', (requisition: any, response: any) => this.getStore(response));
    }

    private getStore(response: any): void {
        response.send(Store.getData());
    }

}
