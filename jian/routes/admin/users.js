const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../../models/user');
const UserService = require('../../services/users');

const userService = new UserService();

router.get('/', function (req, res, next) {
    return res.render('users/list', {title: 'User list'});
});

router.get('/list', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let rows = parseInt(req.query.rows) || 20;
    userService.getUsersPage(page, rows, req.query.key, req.query.status)
        .then(users => {
        return res.json(users);
    });
});

router.get('/add', (req, res) => {
    return res.render('users/edit', {title: 'Add new user'});
});

router.post('/doAdd', (req, res, next) => {
    let body = req.body;
    userService.create(body.name, body.email, body.password, body.remark)
        .then(user => {
            return res.send(user);
        })
        .catch(err => {
            return next(500);
        });
});


module.exports = router;
