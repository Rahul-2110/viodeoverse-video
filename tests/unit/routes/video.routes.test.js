const request = require('supertest');

const app = require('../../../src');
const { clearDatabase, createUsers, users } = require('../../utils/db');
const { initDb } = require('../../../src/db');
const path = require('path'); 
const { UserTable, VideoTable } = require('../../../src/db/tables');
const { Video } = require('../../../src/db/models');


describe('Video Routes', () => {

    beforeAll(async () => {
        await initDb();
        this.video = null
    });


    it('Upload Video', async () => {

        
        let filePath = path.join(__dirname, 'videos/valid_video.mp4');

        let response = await request(app)
            .post('/upload')
            .set('Authorization', 'Bearer ' + users[0].token)
            .attach('video', filePath)

        expect(response.status).toBe(201);

        this.video = response.body.video;

        filePath = path.join(__dirname, 'auth.routes.test.js');

        response = await request(app)
            .post('/upload')
            .set('Authorization', 'Bearer ' + users[0].token)
            .attach('video', filePath)
        
        expect(response.status).toBe(400);

    });


    it('Trim Video', async () => {

        let response = await request(app)
            .post(`/trim/${this.video.id}`)
            .set('Authorization', 'Bearer ' + users[0].token)
            .send({
                start: 5,
                end: 10
            })

        expect(response.status).toBe(200);
        this.video2 = response.body.video;

        response = await request(app)
            .post('/trim/100')
            .set('Authorization', 'Bearer ' + users[0].token)
            .send({
                start: 0,
                end: 10
            })

        expect(response.status).toBe(404);


        response = await request(app)
            .post(`/trim/${this.video.id}`)
            .set('Authorization', 'Bearer ' + users[1].token)
            .send({
                start: 5,
                end: 10
            })

        expect(response.status).toBe(404);



        response = await request(app)
            .post(`/trim/${this.video.id}`)
            .set('Authorization', 'Bearer ' + users[0].token)
            .send({
                start: 100,
                end: 105
            })

        expect(response.status).toBe(400);


        response = await request(app)
            .post(`/trim/${this.video.id}`)
            .set('Authorization', 'Bearer ' + users[0].token)
            .send({
                start: 10,
                end: 105
            })

        expect(response.status).toBe(400);
 

    });


    it('Merge Video', async () => {

        let response = await request(app)
            .post(`/merge`)
            .set('Authorization', 'Bearer ' + users[0].token)
            .send({
                videos: [this.video.id, this.video2.id]
            })
            
        expect(response.status).toBe(200);

        response = await request(app)
            .post(`/merge`)
            .set('Authorization', 'Bearer ' + users[1].token)
            .send({
                videos: [this.video.id, this.video2.id]
            })
            
        expect(response.status).toBe(400);

    });

});
