
import { cpus } from 'node:os';
import process from 'node:process';
import { createServer, request as httpRequest } from 'node:http';
import cluster from "node:cluster";

const numCPUs = cpus().length;
const BASE_PORT = Number(process.env.PORT) || 4000;

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    
    let current = 0;

    for (let i = 1; i < numCPUs; i++) {
        const worker = cluster.fork({ PORT: (BASE_PORT + i).toString() });
    }

    const balancer = createServer((req, res) => {
        const workerPort = BASE_PORT + 1 + (current % (numCPUs - 1));
        current++;

        const proxy = httpRequest(
            {
                hostname: 'localhost',
                port: workerPort,
                path: req.url,
                method: req.method,
                headers: req.headers,
            },
            (backendRes) => {
                res.writeHead(backendRes.statusCode || 500, backendRes.headers);
                backendRes.pipe(res, { end: true });
            }
        );

        req.pipe(proxy, { end: true });

        proxy.on('error', (err) => {
            console.error(`Error forwarding to worker on port ${workerPort}:`, err);
            res.writeHead(500).end('Internal server error in balancer');
        });
    });

    balancer.listen(BASE_PORT, () => {
        console.log(`Load balancer listening on port ${BASE_PORT}`);
    });
} else {
    import('./server');
}
