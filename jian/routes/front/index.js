const express = require('express');
const router = express.Router();

const PostService = require('../../services/posts');
const postService = new PostService();
const moment = require('moment');
const logger = require('log4js').getLogger();

router.get('/', async function (req, res, next) {
    let [page, rows] = [parseInt(req.query.page) || 1, parseInt(req.query.rows) || 20];
    try {
        let posts = await postService.paginate(page, rows, req.query.search, req.query.status, req.query.tag);
        posts.records.forEach((val) => {
            val.displayTime = moment(new Date(val.when * 1000)).format('YYYY-MM-DD HH:mm:ss');
        });
        return res.render('front/index', {title: 'Jian - Record my life', posts: posts.records, pagination: posts.pagination});
    } catch (err) {
        logger.error(err);
        return res.status(500).send(err);
    }
});

module.exports = router;
