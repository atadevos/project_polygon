import express from 'express';
import { getDB } from '../config/db.js';
import { delay } from '../utils/helper.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/polygons', async (req, res) => {
    try {
        // await delay(process.env.RESPONSE_DELAY);
        if (!req.body) {
            return res.status(400).json({ error: 'Name and points are required' });
        }
        const { name, points } = req.body;
        if (!name || !points) {
            return res.status(400).json({ error: 'Name and points are required' });
        }
        const pointsStr = JSON.stringify(points);
        const lastID = await new Promise((resolve, reject) => {
            getDB().run('INSERT INTO polygons (name, points) VALUES (?, ?)', [name, pointsStr], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
        logger().info(`Polygon created with ID: ${lastID}`);
        res.status(201).json({ id: lastID });
    } catch (error) {
        logger().error('Error creating polygon:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/polygons/:id', async (req, res) => {
    try {
        // await delay(process.env.RESPONSE_DELAY);
        const id = req.params.id;
        await new Promise((resolve, reject) => {
            getDB().run('DELETE FROM polygons WHERE id = ?', [id], function (result, err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error('Polygon not found'));
                resolve();
            });
        });
        logger().info(`Polygon with ID: ${id} deleted`);
        res.status(200).json({ message: 'Polygon deleted' });
    } catch (error) {
        const status = error.message === 'Polygon not found' ? 404 : 500;
        logger().error('Error deleting polygon:', error);
        res.status(status).json({ error: error.message });
    }
});

router.get('/polygons', async (req, res) => {
    try {
        // await delay(process.env.RESPONSE_DELAY);
        const polygons = await new Promise((resolve, reject) => {
            getDB().all('SELECT id, name, points FROM polygons', [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        points: JSON.parse(row.points)
                    })));
                }
            });
        });
        res.status(200).json(polygons);
    } catch (error) {
        logger().error('Error fetching polygons:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;