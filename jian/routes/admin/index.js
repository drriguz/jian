const express = require('express');
const router = express.Router();

const importService = require('../../services/tecent');

router.get('/', function (req, res, next) {
    res.render('admin/index', {title: 'Jian'});
});

router.get('/about', (req, res) => {
    res.send('Hello world!');
});

router.get('/import', (req, res) => {
    res.render('admin/import', {title: 'Import from Tecent Weibo'});
});

router.post('/import.action', (req, res) => {
    let body = req.body;
    importService.importFromTecent(body.url)
        .then(result => {
            return res.send('Importing handled');
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});
module.exports = router;
