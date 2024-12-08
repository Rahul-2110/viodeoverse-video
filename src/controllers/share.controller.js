const { config } = require("../config");
const { generateSlug } = require("../db/models/public_links");
const { PublicLinksTable, VideoTable } = require("../db/tables");


const shareVideo = async (req, res) => {
    const { video, ttl = 1440 } = req.body;

    const videoRecord = await VideoTable.findOneBy({ id: video, user: req.user.id });

    if (!videoRecord || videoRecord.user !== req.user.id) {
        return res.status(400).json({ error: 'Video not found' });
    }

    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);
    const slug = generateSlug();

    const sharedVideo = await PublicLinksTable.save({
        video: videoRecord.id,
        slug,
        expire_at: expiresAt,
        isShared: true
    });

    return res.status(200).json({
        message: 'Video shared successfully',
        shareUrl: `${config.get('base_url')}/${slug}`
    });
}

module.exports = { shareVideo };