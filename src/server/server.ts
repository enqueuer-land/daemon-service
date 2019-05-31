import express from 'express';

export class Server {
    private readonly app = express();
    private readonly port: number;

    public constructor(port: number = 3000) {
        this.port = port;

        const parser = (requisition: any, response: any, next: any) => {
            requisition.setEncoding('utf8');
            requisition.rawBody = '';
            requisition.on('data', (chunk: any) => {
                requisition.rawBody += chunk;
            });
            requisition.on('end', () => {
                next();
            });
        };
        this.app.use(parser);

    }

    public getApplication(): any {
        return this.app;
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Enqueuer daemon service is listening on port ${this.port}`);
        });

    }
}
