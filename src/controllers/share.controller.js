const { config } = require("../config");
const { appDataSource } = require("../db");
const { Video, PublicLinks } = require("../db/models");
const { generateSlug } = require("../db/models/public_links");


const shareVideo = async (req, res) => {
    const { video, ttl = 1440 } = req.body;
    const videoTable = appDataSource.getRepository(Video);
    const videoRecord = await videoTable.findOneBy({ id: video, user: req.user.id });

    const publicLinksTable = appDataSource.getRepository(PublicLinks);

    if (!videoRecord || videoRecord.user !== req.user.id) {
        return res.status(400).json({ error: 'Video not found' });
    }

    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);
    const slug = generateSlug();

    const sharedVideo = await publicLinksTable.save({
        video: videoRecord.id,
        slug,
        expire_at: expiresAt,
        isShared: true
    });

    return res.status(200).json({
        message: 'Video shared successfully',
        shareUrl: `${config.get('base_url')}/public/video/${slug}`
    });
}

module.exports = { shareVideo };