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

interface ReportsHistory {
    [propName: string]: OutputRequisitionModel;
}

const reportsHistory: ReportsHistory = {};
// Logger.setLoggerLevel('info');

NotificationEmitter.on(Notifications.REQUISITION_RAN, (notification: OutputRequisitionModel) => {
    console.log(`Requisition #${notification.id} ran`);
    reportsHistory[notification.id] = notification;
});

app.post('/requisitions', async (requisition: any, response: any) => {
    const requisitionModel: InputRequisitionModel = new RequisitionParser().parse(requisition.rawBody);
    try {
        let id: string = requisitionModel.id;
        if (requisitionModel.id === undefined) {
            id = new IdGenerator(requisitionModel).generateId();
            requisitionModel.id = id;
        }
        new RequisitionRunner(requisitionModel).run();
        response.status(200).send({id});
    } catch (e) {
        response.status(400).send(e);
    }
});

app.get('/requisitions/:id', (requisition: any, response: any) => {
    const report = reportsHistory[requisition.params.id];
    response.status(report !== undefined ? 200 : 400).send(report);
});

app.get('/requisitions', (requisition: any, response: any) => {
    response.status(200).send(Object.keys(reportsHistory));
});

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
