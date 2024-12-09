const request = require('supertest');

const app = require('../../../src');
const { clearDatabase } = require('../../utils/db');
const { initDb } = require('../../../src/db');

describe('Auth Routes', () => {


    beforeAll(async () => {
        await initDb();
        await clearDatabase();
    });

    afterAll(async () => {
        await clearDatabase();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Register User', async () => {

        // Register a new user
        let response = await request(app)
            .post('/register')
            .send({
               username: 'testUser'
            })
        expect(response.status).toBe(201);
        expect(response.body.username).toBe('testUser');
        expect(response.body.token).toBeDefined();

        // Register a duplicate user
        response = await request(app)
            .post('/register')
            .send({
                username: 'testUser'
            })
        expect(response.status).toBe(400);

    });


});
