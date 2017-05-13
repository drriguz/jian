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
        let pageCount = total / rows;
        if (total % rows !== 0) pageCount += 1;
        return {
            page: page,
            pageCount: pageCount,
            pageSize: rows,
            total: total,
            records: list,
        };
    }
}
exports = module.exports = PostService;