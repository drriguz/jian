const express = require('express');
const router = express.Router();

const PostService = require('../../services/posts');
const postService = new PostService();
const moment = require('moment');
const logger = require('log4js').getLogger();

router.get('/', async function (req, res, next) {
    let msgType = parseInt(req.query.type) || null;
    try {
        let posts = await postService.next(
            req.query.last,
            parseInt(req.query.rows) || 15,
            req.query.search,
            msgType,
            req.query.tag);
        return res.send(posts);
    } catch (err) {
        logger.error(err);
        return res.status(500).send(err);
    }
});

module.exports = router;
