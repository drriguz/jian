const User = require('../models/user');
const logger = require('log4js').getLogger('users');

class UserService {
    async getUsersPage(page, rows, key, status) {
        let args = {};
        if (status && status.trim() !== '') args.status = status;
        if (key && key.trim() !== '') {
            let c = new RegExp(key, 'i');
            args.$or = [
                {name: c},
                {email: c},
            ];
        }
        let total = await User.find(args).count();
        let list = await  User.find(args).skip((page - 1) * rows).limit(rows).lean().exec();
        return {
            page: page,
            records: total,
            rows: list,
            total: Math.ceil(total / rows),
        };
    }

    async create(name, email, password, remark) {
        let user = new User({
            name: name,
            email: email,
            password: password,
            remark: remark,
            retryCount: 0,
            status: 'N',
            lastLoginDate: null,
            registeredDate: Date.now(),
        });
        user = await user.save();
        return user;
    }
}
module.exports = UserService;