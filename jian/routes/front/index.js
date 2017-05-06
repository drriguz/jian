const express = require('express');
const router = express.Router();

const postService = require('../../services/posts');
const moment = require('moment');

router.get('/', async function (req, res, next) {
    let [page, rows] = [parseInt(req.query.page) || 1, parseInt(req.query.rows) || 20];
    try {
        let posts = await postService.getPosts(page, rows);
        posts.forEach((val) => {
            val.displayTime = moment(new Date(val.when * 1000)).format('YYYY-MM-DD HH:mm:ss');
        });
        return res.render('front/index', {title: 'Jian - Record my life', posts: posts});
    } catch (err) {
        return res.status(500).send(err);
    }
});

module.exports = router;
