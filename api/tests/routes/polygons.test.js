import { jest } from '@jest/globals'
import request from 'supertest';
import express from 'express';
import * as realHelper from '../../src/utils/helper.js';


jest.unstable_mockModule('../../src/utils/helper.js', async () => {
  return {
    ...realHelper,
    delay: jest.fn().mockResolvedValue('fast!'),
  };
});

jest.unstable_mockModule('../../src/config/db.js', () => (
  {
    getDB: jest.fn(),
    initialize: jest.fn().mockResolvedValue(),
  })
);

const mockDb = {
  run: jest.fn(),
  all: jest.fn(),
  close: jest.fn(),
};

const { default: router } = await import('../../src/routes/polygons.js');
// const { getDB } = await import('../../src/config/db.js');

const app = express();
app.use(express.json());
app.use('/api', router);


describe('Polygon Routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    const { getDB } = await import('../../src/config/db.js');
    getDB.mockReturnValue(mockDb);
    // getDB.mockReturnValue(mockDb);
  });

  describe('POST /api/polygons', () => {
    test('create new polygon successfully', async () => {

      const { delay } = await import('../../src/utils/helper.js');
      const { getDB } = await import('../../src/config/db.js');

      const db = getDB();

      const mockPolygon = { name: 'Test Polygon', points: [[0, 0], [1, 1], [2, 2]] };
      db.run.mockImplementationOnce((sql, params, callback) => {
        callback.call({ lastID: 1 }, null);
      });

      const response = await request(app)
        .post('/api/polygons')
        .send(mockPolygon)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(db.run).toHaveBeenCalledWith(
        'INSERT INTO polygons (name, points) VALUES (?, ?)',
        [mockPolygon.name, JSON.stringify(mockPolygon.points)],
        expect.any(Function)
      );
      // expect(delay).toHaveBeenCalledWith(5000);
    });

    test('return 400 if body is empty', async () => {
      const { delay } = await import('../../src/utils/helper.js');
      const { getDB } = await import('../../src/config/db.js');
      const response = await request(app)
        .post('/api/polygons')
        .send()
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Name and points are required');
      expect(getDB().run).not.toHaveBeenCalled();
      // expect(delay).toHaveBeenCalledWith(5000);
    });


    test('return 400 if no name passed', async () => {
      const response = await request(app)
        .post('/api/polygons')
        .send({ points: [[0, 0], [1, 1], [2, 2]] })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Name and points are required');
    });


    test('return 400 if no points passed', async () => {
      const response = await request(app)
        .post('/api/polygons')
        .send({ name: 'Test Polygon' })
        .expect(400);
      expect(response.body).toHaveProperty('error', 'Name and points are required');
    });

    test('return 500 if database error on create', async () => {
      const { getDB } = await import('../../src/config/db.js');
      getDB().run.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'));
      });

      const response = await request(app)
        .post('/api/polygons')
        .send({ name: 'Test', points: [[0, 0], [1, 1]] })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Database error');
    });
  });
  describe('DELETE /api/polygons/:id', () => {
    test('delete polygon successfully', async () => {

      const { delay } = await import('../../src/utils/helper.js');
      const { getDB } = await import('../../src/config/db.js');

      getDB().run.mockImplementationOnce((sql, params, callback) => {
        callback.call({ changes: 1 }, null);
      });

      const response = await request(app)
        .delete('/api/polygons/1')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Polygon deleted');
      expect(getDB().run).toHaveBeenCalledWith(
        'DELETE FROM polygons WHERE id = ?',
        ['1'],
        expect.any(Function)
      );
      // expect(delay).toHaveBeenCalledWith(5000);
    });

    test('return 500 if database error on delete', async () => {
      const { getDB } = await import('../../src/config/db.js');
      getDB().run.mockImplementationOnce((sql, params, callback) => {
        callback({}, new Error('Database error'));
      });

      const response = await request(app)
        .delete('/api/polygons/1')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Database error');
    });
  });


  describe('GET /api/polygons', () => {
    test('fetch all polygons successfully', async () => {
      const { delay } = await import('../../src/utils/helper.js');
      const { getDB } = await import('../../src/config/db.js');
      const mockPolygons = [
        { id: 1, name: 'Polygon 1', points: '[[0,0],[1,1],[2,2]]' },
        { id: 2, name: 'Polygon 2', points: '[[3,3],[4,4],[5,5]]' },
      ];
      getDB().all.mockImplementationOnce((sql, params, callback) => {
        callback(null, mockPolygons);
      });

      const response = await request(app)
        .get('/api/polygons')
        .expect(200);

      expect(response.body).toEqual([
        { id: 1, name: 'Polygon 1', points: [[0, 0], [1, 1], [2, 2]] },
        { id: 2, name: 'Polygon 2', points: [[3, 3], [4, 4], [5, 5]] },
      ]);
      // expect(delay).toHaveBeenCalledWith(5000);
    });

    test('return empty array if no polygons in db', async () => {
      const { getDB } = await import('../../src/config/db.js');
      getDB().all.mockImplementationOnce((sql, params, callback) => {
        callback(null, []);
      });

      const response = await request(app)
        .get('/api/polygons')
        .expect(200);

      expect(response.body).toEqual([]);
    });
    test('return 500 on db error on fetch', async () => {
      const { getDB } = await import('../../src/config/db.js');
      getDB().all.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'));
      });

      const response = await request(app)
        .get('/api/polygons')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Database error');
    });
  });
});