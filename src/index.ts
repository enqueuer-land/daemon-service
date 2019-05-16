#!/usr/bin/env node

import express from 'express';
import {RequisitionParser} from 'enqueuer/js/requisition-runners/requisition-parser';
import {RequisitionRunner} from 'enqueuer/js/requisition-runners/requisition-runner';
import {Store} from 'enqueuer/js/configurations/store';
import {Configuration} from 'enqueuer/js/configurations/configuration';
import {ReportModel} from 'enqueuer/js/models/outputs/report-model';

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

const reportsHistory: any = {};

// Logger.setLoggerLevel('trace');
app.post('/requisitions', async (requisition: any, response: any) => {
    const requisitionModel = new RequisitionParser().parse(requisition.rawBody);
    try {
        const reports = await new RequisitionRunner(requisitionModel).run();
        reports.forEach((item: ReportModel) => reportsHistory[item.id] = item);
        response.send(reports);
    } catch (e) {
        response.status(400).send(e);
    }
});

app.get('/reports/:id', async (requisition: any, response: any) => {
    const report = reportsHistory[requisition.params.id];
    response.status(report !== undefined ? 200 : 400).send(report);
});

app.get('/store', async (requisition: any, response: any) => {
    response.send(Store.getData());
});

app.post('/plugins', async (requisition: any, response: any) => {
    const pluginsList = JSON.parse(requisition.rawBody);
    pluginsList.forEach((plugin: string) => Configuration.getInstance().addPlugin(plugin));
    response.status(200).send();
});

app.get('/configurations', async (requisition: any, response: any) => {
    response.send(Configuration.getInstance());
});

let port = 3000;
if (process.argv.length > 3 && process.argv[2].toLowerCase() === '-p') {
    port = Number(process.argv[3]);
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
