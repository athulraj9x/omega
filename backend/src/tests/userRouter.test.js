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

    describe('POST /api/v1/registration', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/registration')
                .send(validUserData);

            expect(response.status).toBe(200);
            expect(response.body.meta.message).toBe('UserAddedSuccessfully');

            const user = await User.findOne({ email: validUserData.email });
            expect(user).toBeTruthy();
            expect(user.first_name).toBe(validUserData.first_name);
            expect(user.status).toBe('0');

            const wallet = await UserWallet.findOne({ userId: user._id });
            expect(wallet).toBeTruthy();

            const otp = await Otp.findOne({ user_id: user._id });
            expect(otp).toBeTruthy();
        });

        it('should return error if email already exists', async () => {
            await User.create({ ...validUserData, email: 'existing@example.com' });

            const response = await request(app)
                .post('/api/v1/registration')
                .send({ ...validUserData, email: 'existing@example.com' });

            expect(response.body.data).toBe(null);
            expect(response.body.meta.code).toBe(400);
            expect(response.body.meta.message).toBe('emailAlreadyRegistered');
            expect(response.status).toBe(200);
        });

        it('should handle validation errors', async () => {
            const invalidData = { ...validUserData, email: 'invalid-email' };
            const response = await request(app)
                .post('/api/v1/registration')
                .send(invalidData);

            expect(response.status).toBe(200);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe('userRegisterValidationEmailEmail')
        });
    });

});