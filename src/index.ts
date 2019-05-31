#!/usr/bin/env node

import {RequisitionController} from './controllers/requisition-controller';
import {Controller} from './controllers/controller';
import {Server} from './server/server';
import {PluginController} from './controllers/plugin-controller';
import {ConfigurationController} from './controllers/configuration-controller';
import {StoreController} from './controllers/store-controller';
import {ModulesController} from './controllers/modules-controller';

let port = 3000;
if (process.argv.length > 3 && process.argv[2].toLowerCase() === '-p') {
    port = Number(process.argv[3]);
}
const server = new Server(port);
server.start();
// Logger.setLoggerLevel('info');

const controllers: Controller[] = [].concat();
controllers.push(new RequisitionController());
controllers.push(new PluginController());
controllers.push(new ConfigurationController());
controllers.push(new StoreController());
controllers.push(new ModulesController());
controllers.forEach((controller: Controller) => controller.registerRoute(server));
