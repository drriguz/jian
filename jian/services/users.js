const User = require('../models/user');
const logger = require('log4js').getLogger('users');

function createUser(name, email, password, remark) {
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
    return user.save();
}

function getUsers(page, rows) {
    let query = User.find({});
    if (page && rows) {
        query = query
            .skip((page - 1) * rows)
            .limit(rows);
    }
    return query.exec();
}

module.exports = {
    createUser: createUser,
    getUsers: getUsers,
};