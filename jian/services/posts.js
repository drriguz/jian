const Post = require('../models/post');
const logger = require('log4js').getLogger('users');

class PostService {
    async paginate(page, rows, search, status, tag) {
        let query = {};
        if (search) query.content = new RegExp(search, 'i');
        if (status) query.status = status;
        if (tag) query.tag = {$elemMatch: {$eq: tag}};
        let total = await Post.find(query).count();
        let list = await Post.find(query).sort('-when').skip((page - 1) * rows).limit(rows);
        let pageCount = Math.ceil(total / rows);
        let pagination = {
            page: page,
            pageCount: pageCount,
            pageSize: rows,
            total: total,
        };
        console.log(pagination);
        return {
            records: list,
            pagination: pagination,
        };
    }
}
exports = module.exports = PostService;