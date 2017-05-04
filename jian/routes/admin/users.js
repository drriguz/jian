const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../../models/user');
const userService = require('../../services/users');

router.get('/', function (req, res, next) {
    userService.getUsers()
        .then(users => {
            return res.render('users/list', {title: 'User list', users: users});
        })
});

router.get('/list', (req, res) => {
    User.find().exec().then(users => {
        let result = {
            page:1,
            total: users.length,
            records:users.length,
            rows: users
        };
        return res.json(result);
    });
});

router.get('/add', (req, res) => {
    return res.render('users/edit', {title: 'Add new user'});
});

router.post('/doAdd', (req, res, next) => {
    let body = req.body;
    userService.createUser(body.name, body.email, body.password, body.remark)
        .then(user => {
            return res.send(user);
        })
        .catch(err => {
            return next(500);
        });
});


module.exports = router;
