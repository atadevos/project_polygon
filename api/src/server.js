import dotenv from 'dotenv';
import { initialize as dbInitialize } from './config/db.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await dbInitialize();
        logger().info(`Running in ${process.env.NODE_ENV || 'development'} mode`);

        //dynamically import app to initialize after dotenv.config()
        const { default: app } = await import('./app.js');

        const server = app.listen(PORT, () => {
            logger().info(`Server running on port ${PORT}`);
        });


        server.on('error', (err) => {
            logger().error(`Server failed to start: ${err.message}`);
            process.exit(1);
        });

    } catch (err) {
        logger().error('Failed to initialize application:', err);
        process.exit(1);
    }
})();