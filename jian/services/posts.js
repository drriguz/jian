const Post = require('../models/post');
const logger = require('log4js').getLogger('users');

class PostService {
    static buildQuery(search, type, tag) {
        let query = {};
        if (search) query.content = new RegExp(search, 'i');
        if (type) query.msgType = type;

        if (tag) query.tag = {$elemMatch: {$eq: tag}};
        return query;
    }

    async paginate(page, rows, search, type, tag) {
        let query = PostService.buildQuery(search, type, tag);
        console.log(query);
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

    async next(last, limit, search, type, tag) {
        let query = PostService.buildQuery(search, type, tag);
        if (last) {
            let lastItem = await Post.findById(last);
            if (!lastItem)
                return Promise.reject("Item not found");
            let paginationArgs = {
                $or: [
                    {
                        when: {$lt: lastItem.when}
                    },
                    {
                        when: {$eq: lastItem.when},
                        _id: {$lt: lastItem._id}
                    },
                ],
            };
            query.$and = [paginationArgs];
        }
        let list = await Post.find(query).sort('-when -_id').limit(limit);
        return list;
    }
}
exports = module.exports = PostService;