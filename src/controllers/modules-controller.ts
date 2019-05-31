import {Controller} from './controller';
import {Server} from '../server/server';
import {DynamicModulesManager} from 'enqueuer';

export class ModulesController implements Controller {

    public registerRoute(server: Server): void {
        server.getApplication()
            .get('/modules', (requisition: any, response: any) => this.getLoadedModules(response));
    }

    private getLoadedModules(response: any): void {
        response.status(200).send(DynamicModulesManager.getInstance().getLoadedModules());
    }

}
