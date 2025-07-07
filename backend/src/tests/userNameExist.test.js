const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('../testUtils/setupTestDB');
const createApp = require('../../index');
const { Game, Otp, UserWallet, User } = require('../models');

jest.mock('../config/redisClient', () => ({
    redisClient: {
        connect: jest.fn().mockResolvedValue(true),
        quit: jest.fn().mockResolvedValue(true),
        isOpen: true,
        on: jest.fn()
    }
}));

jest.mock('aws-sdk', () => ({
    config: {
        correctClockSkew: true,
        update: jest.fn()
    },
    S3: jest.fn(() => ({
        upload: jest.fn().mockReturnThis(),
        promise: jest.fn()
    }))
}));

jest.mock('../services/Mailer', () => ({
    sendMail: jest.fn().mockResolvedValue(true)
}));

describe('User Routes', () => {
    let app;
    let server;
    const validUserData = {
        first_name: 'nil',
        last_name: 'kaneriya',
        username: 'n@gmail.com',
        email: 'n@gmail.com',
        password: 'Nil@3102',
        mobile_no: '9157168398',
        device_code: '3de2de2457cd02630d6ad86e550d58c482fbe94d'
    };

    beforeAll(async () => {
        const appInstance = createApp();
        app = appInstance.app;
        server = appInstance.server;
        await connect();
    }, 30000);

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
        if (server && server.close) {
            await new Promise(resolve => server.close(resolve));
        }
    });
    describe('GET /api/v1/username', () => {
        beforeEach(async () => {
            await User.create({ username: 'takenusername' });
        });

        it('should return success if username exists', async () => {
            const response = await request(app)
                .get('/api/v1/username')
                .query({ username: 'takenusername' });
            expect(response.status).toBe(200);
            expect(response.body.meta.message).toBe('userAlreadyExist');
            expect(response.body.meta.code).toBe(200);
        });

        it('should return error if username does not exist', async () => {
            const response = await request(app)
                .get('/api/v1/username')
                .query({ username: 'nonexistent' });

            expect(response.status).toBe(200);
            expect(response.body.data).toBe(null);
            expect(response.body.meta.message).toBe('userNotExist');
            expect(response.body.meta.code).toBe(400);
        });
    });

});