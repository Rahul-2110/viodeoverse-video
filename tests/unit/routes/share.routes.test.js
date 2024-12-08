const request = require('supertest');

const app = require('../../../src');
const { clearDatabase, createUsers, users } = require('../../utils/db');
const { initDb } = require('../../../src/db');
const path = require('path'); 
const { UserTable, VideoTable, PublicLinksTable } = require('../../../src/db/tables');
const { Video } = require('../../../src/db/models');
const exp = require('constants');


describe('Video Routes', () => {

    beforeAll(async () => {
        await initDb();
        this.video = null
    });


    it('Share Video', async () => {

        
        let filePath = path.join(__dirname, 'videos/valid_video.mp4');

        let response = await request(app)
            .post('/upload')
            .set('Authorization', 'Bearer ' + users[0].token)
            .attach('video', filePath)

        expect(response.status).toBe(201);
        this.video = response.body.video;

        response = await request(app)
            .post('/share')
            .set('Authorization', 'Bearer ' + users[0].token)
            .send({
                "video": this.video.id,
                "ttl": 10
            });

        expect(response.status).toBe(200);
        expect(response.body.shareUrl).toBeDefined();
        this.sharedVideo = response.body.shareUrl;

        response = await request(app)
            .post('/share')
            .set('Authorization', 'Bearer ' + users[1].token)
            .send({
                "video": this.video.id,
                "ttl": 10
            });

        expect(response.status).toBe(400);

    });



    it('Get Shared Video', async () => {

        let slug = this.sharedVideo.split('/')[1];
        let response = await request(app)
            .get(`/${slug}`)
        
        expect(response.status).toBe(200);

        response = await request(app)
            .get(`/share/${this.video.id}`)

        expect(response.status).toBe(404);

        await PublicLinksTable.createQueryBuilder()
            .update()
            .set({ expire_at: new Date(Date.now() - 1 * 60 * 1000) })
            .where("slug = :slug", { slug })
            .execute();


        response = await request(app)
            .get(`/${slug}`)

        expect(response.status).toBe(404);
       
    });
});
