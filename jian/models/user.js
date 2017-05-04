const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchama = new Schema({
    name: String,
    email: String,
    password: String,
    status: String,
    registeredDate: Date,
    lastLoginDate: Date,
    retryCount: Number,
    remark: String,
});

module.exports = mongoose.model('User', userSchama);

userSchama.methods.print = function () {
    let msg = 'name:' + this.name
        + '\nemail:' + this.title;
    console.log(msg);
};
