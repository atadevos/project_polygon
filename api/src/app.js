import express from 'express';
import logger from './utils/logger.js';
import router from './routes/polygons.js';
import cors from 'cors';
import { delay } from './utils/helper.js';

const INVALID_JSON = 'Invalid_JSON';

const app = express();

app.use(cors());

app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
        return res.status(400).json({ error: 'Request must be JSON' });
    }

    //verify JSON body and parse
    express.json({
        verify: (req, res, buf) => {
            try {
                const bufStr = buf.toString();
                if (bufStr.length === 0) {
                    return;
                }
                JSON.parse(bufStr);
            } catch (e) {
                logger().error('Error in json verify', e);
                const err = new Error('Invalid JSON format');
                err.name = INVALID_JSON;
                throw err;
            }
        }
    })(req, res, next);
});

//log requests
app.use((req, res, next) => {
    logger().info(`${req.method} ${req.url}`);
    next();
});

app.use('/api', async (req, res, next) => { await delay(process.env.RESPONSE_DELAY); next(); }, router);

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    logger().error('Global error handler:', err);
    if(err.name === INVALID_JSON) {
        return res.status(400).json({ error: 'Invalid JSON format' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;