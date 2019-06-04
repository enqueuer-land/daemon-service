import {Controller} from './controller';
import {Configuration} from 'enqueuer';
import {Server} from '../server/server';

export class ConfigurationController implements Controller {

    public registerRoute(server: Server): void {
        server.getApplication()
            .get('/configurations', (requisition: any, response: any) => this.getConfiguration(response));
    }

    private getConfiguration(response: any): void {
        response.send(Configuration.getInstance().getValues());
    }

}
