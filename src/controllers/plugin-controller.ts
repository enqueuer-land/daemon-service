import {Controller} from './controller';
import {Configuration} from 'enqueuer';
import {Server} from '../server/server';

type PostPluginReport = { [propName: string]: boolean };

export class PluginController implements Controller {

    public registerRoute(server: Server): void {
        server.getApplication()
            .post('/plugins', (requisition: any, response: any) => this.postPlugin(requisition, response))
            .get('/plugins', (requisition: any, response: any) => this.getPlugin(response));

    }

    private getPlugin(response: any): void {
        response.status(200).send(Configuration.getInstance().getPlugins());
    }

    private postPlugin(requisition: any, response: any): void {
        const configuration = Configuration.getInstance();
        const result: PostPluginReport = {};
        const pluginsList = JSON.parse(requisition.rawBody);
        pluginsList.forEach((plugin: string) => result[plugin] = configuration.addPlugin(plugin));
        response.status(200).send(result);
    }

}
