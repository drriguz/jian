const express = require('express');
const router = express.Router();

const postService = require('../../services/posts');
const co = require('co');
const moment = require('moment');

router.get('/', function (req, res, next) {
    co(function *() {
        let posts = yield postService.getPosts(1, 10);
        posts.forEach((val) => {
            val.displayTime = moment(new Date(val.when * 1000)).format('YYYY-MM-DD HH:mm:ss');
        });
        return res.render('front/index', {title: 'Jian - Record my life', posts: posts});
    });
});

module.exports = router;
