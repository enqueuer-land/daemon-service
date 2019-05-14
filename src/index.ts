import express from 'express';
import {RequisitionParser} from 'enqueuer/js/requisition-runners/requisition-parser';
import {RequisitionRunner} from 'enqueuer/js/requisition-runners/requisition-runner';
import {Store} from 'enqueuer/js/configurations/store';
import {Configuration} from 'enqueuer/js/configurations/configuration';

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

app.post('/requisitions', async (requisition: any, response: any) => {
    const requisitionModel = new RequisitionParser().parse(requisition.rawBody);
    const reports = await new RequisitionRunner(requisitionModel).run();
    response.send(reports);
});

app.get('/stores', async (requisition: any, response: any) => {
    response.send(Store.getData());
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
