import {Controller} from './controller';
import {
    IdGenerator,
    InputRequisitionModel,
    NotificationEmitter,
    Notifications,
    OutputRequisitionModel,
    RequisitionParser,
    RequisitionRunner
} from 'enqueuer';

interface ReportsHistory {
    [propName: string]: OutputRequisitionModel[];
}

export class RequisitionController implements Controller {
    private reportsHistory: ReportsHistory = {};

    public registerRoute(app: any): void {
        NotificationEmitter.on(Notifications.REQUISITION_RAN, (notification: OutputRequisitionModel) => this.onNotificationRan(notification));

        app.post('/requisitions', (requisition: any, response: any) => this.postRequisitions(requisition, response))
            .get('/requisitions/:id', (requisition: any, response: any) => this.getSingleRequisition(requisition, response))
            .get('/requisitions', (requisition: any, response: any) => this.getRequisitions(response));

    }

    private getRequisitions(response: any) {
        response.status(200).send(Object.keys(this.reportsHistory));
    }

    private getSingleRequisition(requisition: any, response: any): void {
        const report = this.reportsHistory[requisition.params.id];
        response.status(report !== undefined ? 200 : 404).send(report);
    }

    private postRequisitions(requisition: any, response: any): void {
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
    }

    private onNotificationRan(notification: OutputRequisitionModel): void {
        console.log(`Requisition #${notification.id} ran`);
        const reportsHistoryElement = this.reportsHistory[notification.id];
        if (reportsHistoryElement === undefined) {
            this.reportsHistory[notification.id] = [notification];
        } else {
            this.reportsHistory[notification.id].push(notification);
        }
    }
}
