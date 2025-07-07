    // describe('GET /api/v1/get-live-games', () => {
    //     beforeEach(async () => {
    //         const user1 = await User.create({
    //             username: 'player1',
    //             google_pic: 'http://google.com/pic1.jpg'
    //         });
    //         const user2 = await User.create({
    //             username: 'player2',
    //             profile_pic: 'profile2.jpg'
    //         });

    //         await Game.create({
    //             roomId: 'room1',
    //             totalOver: 6,
    //             over: 3,
    //             isRoundFinish: false,
    //             playerLimit: 2,
    //             players: [
    //                 { userId: user1._id, userName: 'player1' },
    //                 { userId: user2._id, userName: 'player2' }
    //             ]
    //         });

    //         await Game.create({
    //             roomId: 'room2',
    //             totalOver: 6,
    //             over: 0,
    //             isRoundFinish: false,
    //             playerLimit: 2,
    //             players: [{ userId: user1._id, userName: 'player1' }]
    //         });
    //     });

    //     it('should return only ready games with player details', async () => {
    //         const response = await request(app)
    //             .get('/api/v1/get-live-games')
    //             .set('authorization', "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Nzc5NWNmMDVkYzk2NTc3YWEzNjg2ZiIsImlhdCI6MTc1MTAyNTkxN30.zNnMKGrzXZ92WyA7VGRWt7OFC8qREkI94SNh-u6ilwpKu7cXfnyIiabTG-HRam8lTTDwDTb7GysQ4e1FURDYUg");

    //         console.log(response.body)
    //         expect(response.status).toBe(200);
    //         // expect(response.body.data.length).toBe(1);
    //         // expect(response.body.data[0].roomId).toBe('room1');
    //         // expect(response.body.data[0].players.length).toBe(2);
    //         // expect(response.body.data[0].progressPercent).toBe('50.00');
    //     });

    //     // it('should return empty array if no games available', async () => {
    //     //     await Game.deleteMany({});
    //     //     const response = await request(app)
    //     //         .get('/api/v1/get-live-games')
    //     //         .set('Authorization', 'valid-token');

    //     //     expect(response.status).toBe(200);
    //     //     expect(response.body.data).toEqual([]);
    //     //     expect(response.body.meta.message).toBe('noGameAvailable');
    //     // });
    // });

    // describe('GET /api/v1/get-live-game-progress', () => {
    //     beforeEach(async () => {
    //         await Game.create({
    //             roomId: 'testroom',
    //             totalOver: 6,
    //             over: 2,
    //             isRoundFinish: false,
    //             players: []
    //         });
    //     });

    //     it('should return game progress for valid roomId', async () => {
    //         const response = await request(app)
    //             .get('/api/v1/get-live-game-progress')
    //             .query({ roomId: 'testroom' })
    //             .set('Authorization', 'valid-token');

    //         expect(response.status).toBe(200);
    //         expect(response.body.data.roomId).toBe('testroom');
    //         expect(response.body.data.progress.progressPercent).toBe('33.33');
    //     });

    //     it('should return error for invalid roomId', async () => {
    //         const response = await request(app)
    //             .get('/api/v1/get-live-game-progress')
    //             .query({ roomId: 'nonexistent' })
    //             .set('Authorization', 'valid-token');

    //         expect(response.status).toBe(200);
    //         expect(response.body.data).toEqual({});
    //         expect(response.body.meta.message).toBe('noGameAvailable');
    //     });

    //     it('should return error when roomId is missing', async () => {
    //         const response = await request(app)
    //             .get('/api/v1/get-live-game-progress')
    //             .set('Authorization', 'valid-token');

    //         expect(response.status).toBe(400);
    //         expect(response.body.meta.message).toBe('invalidRoomId');
    //     });
    // });