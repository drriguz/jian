const Post = require('../models/post');
const logger = require('log4js').getLogger('users');

function getPosts(page, rows) {
    let query = Post.find({});
    if (page && rows) {
        query = query
            .skip((page - 1) * rows)
            .limit(rows);
    }
    return query.lean().exec();
}

module.exports = {
    getPosts: getPosts,
};