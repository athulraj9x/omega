
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

jest.mock('../services/Mailer', () => ({
    sendMail: jest.fn().mockResolvedValue(true)
}));

describe('User Routes', () => {
    let app;
    let server;

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
    describe('POST /api/v1/email_verify', () => {
        beforeEach(async () => {
            const user = await User.create({
                username: 'n@gmom',
                email: 'test@example.com',
                status: '0'
            });

            await Otp.create({
                user_id: user._id,
                otp: '1234',
                code_expiry: new Date(Date.now() + 15 * 60000)
            });

        });

        it('should verify email successfully with valid OTP', async () => {
            const response = await request(app)
                .post('/api/v1/email_verify')
                .send({ email: 'test@example.com', otp: '1234' });
            expect(response.status).toBe(200);
            expect(response.body.meta.code).toBe(200);

            const user = await User.findOne({ email: 'test@example.com' });
            expect(user.status).toBe('1');

            const otp = await Otp.findOne({ user_id: user._id });
            expect(otp).toBeNull();
        });

        it('should return error for expired OTP', async () => {
            const user = await User.findOne({ email: 'test@example.com' });
            await Otp.updateOne(
                { user_id: user._id },
                { code_expiry: new Date(Date.now() - 1000) }
            );

            const response = await request(app)
                .post('/api/v1/email_verify')
                .send({ email: 'test@example.com', otp: '1234' });

            expect(response.status).toBe(200);
            expect(response.body.meta.code).toBe(400);
            expect(response.body.data).toBe(null);
            expect(response.body.meta.message).toBe('otpExpired');
        });

        it('should return error for invalid OTP', async () => {
            const response = await request(app)
                .post('/api/v1/email_verify')
                .send({ email: 'test@example.com', otp: '1457' });

            expect(response.status).toBe(200);
            expect(response.body.meta.code).toBe(400);
            expect(response.body.meta.message).toBe('otpNotExist');
        });
    });

})