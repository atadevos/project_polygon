import sqlite3 from 'sqlite3';
import fs from 'fs';
import logger from '../utils/logger.js';

let dbInstance = null;

function getDB() {

    if(dbInstance) {
        return dbInstance;
    }

    const dirPath = process.env.DB_DIR ||  './var/data'

    try {
        fs.mkdirSync(dirPath, { recursive: true });
    } catch (err) {
        logger().error('Error creating directory for db:', err);
        throw err;
    }
    const dbPath = `${dirPath}/polygons.db`;

    logger().info(`Database path: ${dbPath}`);

    /**
     * SQLite database connection
     */
    dbInstance = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            logger().error('Error connecting to db:', err);
            throw err;
        }
        logger().info('Connected to db');
    });

    return dbInstance;
}

/**
 * Initialize the database by creating the polygons table if it doesn't exist.
 * poligons table has the following columns:
 * - id: INTEGER PRIMARY KEY AUTOINCREMENT
 * - name: VARCHAR(100) NOT NULL
 * - points: TEXT NOT NULL
 */
async function initialize() {
    return new Promise((resolve, reject) => {
        getDB().run(`CREATE TABLE IF NOT EXISTS polygons (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(100) NOT NULL,
                    points TEXT NOT NULL
                )`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

export { initialize, getDB };