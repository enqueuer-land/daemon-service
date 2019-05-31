#!/usr/bin/env node

import express from 'express';
import {
    InputRequisitionModel,
    IdGenerator,
    Store,
    Configuration,
    DynamicModulesManager,
    RequisitionRunner,
    Notifications,
    NotificationEmitter,
    Logger,
    RequisitionParser,
    OutputRequisitionModel
} from 'enqueuer';
import {RequisitionController} from './controllers/RequisitionController';
import {Controller} from './controllers/controller';

const app = express();

app.use((req: any, res: any, next: any) => {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', (chunk: any) => {
        req.rawBody += chunk;
    });
    req.on('end', () => {
        next();
    });
});

// Logger.setLoggerLevel('info');

const controllers: Controller[] = [];
controllers.push(new RequisitionController());

controllers.forEach((controller: Controller) => controller.registerRoute(app));

app.get('/store', async (requisition: any, response: any) => {
    response.send(Store.getData());
});

app.post('/plugins', (requisition: any, response: any) => {
    const result: any = {};
    const pluginsList = JSON.parse(requisition.rawBody);
    pluginsList.forEach((plugin: string) => result[plugin] = Configuration.getInstance().addPlugin(plugin));
    response.status(200).send(result);
});

app.get('/plugins', (requisition: any, response: any) => {
    response.status(200).send(Configuration.getInstance().getPlugins());
});

app.get('/loadedModules', (requisition: any, response: any) => {
    response.status(200).send(DynamicModulesManager.getInstance().getLoadedModules());
});

app.get('/configurations', (requisition: any, response: any) => {
    response.send(Configuration.getInstance().getValues());
});

let port = 3000;
if (process.argv.length > 3 && process.argv[2].toLowerCase() === '-p') {
    port = Number(process.argv[3]);
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
