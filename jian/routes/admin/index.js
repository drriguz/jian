const express = require('express');
const router = express.Router();

const importService = require('../../services/spider');
const MmService = require('../../services/mm');

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
    importService.importFromTecent(body.url, 1, parseInt(body.min) || 1, parseInt(body.max) || 100);
    return res.send('Request handled:Importing from Tecent Weibo');
});
router.post('/importMm.action', (req, res) => {
    let body = req.body;
    let mmServices = new MmService(body.path, body.type);
    mmServices.extractPosts();
    return res.send('Request handled:Importing from Weixin');
});
module.exports = router;
