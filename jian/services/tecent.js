const Promise = require('bluebird');
const co = require('co');
const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const moment = require('moment');
const Post = require('../models/post');
const logger = require('log4js').getLogger();


class TecentWeiboSpider{
    constructor($){
        this.$ = $;
    }
    extractAll(){
        const $ = this.$;

    }
}
function importFromTecent(url) {
    logger.debug('importing from:', url);
    return co(function*() {
        let $ = yield fetch(url);
        let t = $('#talkList').children('li').map((i, item) => {
            co(function*() {
                logger.debug('fetching post...');
                let post = yield extractItem($, i, $(item));
                logger.debug('fetch success:', post);
                post = yield post.save();
            }).catch(err => {
                logger.error(err.message);
            });
        });
    });
}

function fetch(url) {
    let options = {
        url: url,
        transform: (body) => {
            return cheerio.load(body, {decodeEntities: false});
        }
    };
    return request(options);
}
function extractImage($, a, postTime) {
    let src = $(a).attr('href');
    let img = $(a).children('img').get(0);
    let thumb = $(img).attr('crs');
    return co(function*() {
        let localThumb = yield downloadImage(thumb, postTime || new Date());
        let localImage = yield downloadImage(src, postTime || new Date());
        let imgGroup = {
            thumb: localThumb,
            src: localImage,
        };
        return Promise.resolve(imgGroup);
    });
}
function download(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}
const downloadPromise = Promise.promisify(download);

function downloadImage(url, postTime) {
    let arr = url.split('/');
    let fileName = arr[arr.length - 2] + '.jpg';
    let dir = moment(postTime).format('YYYY/MM/DD/');
    let savePath = path.join(__dirname, '../public/postpic', dir + fileName);
    let saveDir = path.join(__dirname, '../public/postpic', dir);
    fsExtra.ensureDirSync(saveDir);
    return co(function *() {
        let img = yield downloadPromise(url, savePath);
        return Promise.resolve(dir + fileName);
    }).catch(err => {
        return Promise.reject(err);
    });
}
function extractImages($, mediaWrap) {
    let images = [];
    if (mediaWrap.length <= 0) return Promise.resolve([]);
    return co(function*() {
            let pictureGroup = mediaWrap.children('.tl_imgGroup');
            if (pictureGroup.length > 0) {
                let items = pictureGroup.children('.tl_imgGroup_item');
                items.map((i, item) => {
                    co(function *() {
                        let a = $(item).children('a').get(0);
                        let imgItem = yield extractImage(a);
                        images.push(imgItem);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                });
            }
            else {
                let a = mediaWrap.children('.picBox').children('a').get(0);
                let imgItem = extractImage(a);
            }
            return Promise.resolve(images);
        }
    );
}
function extractItem(item) {
    let id = item.attr('id');
    let msgBox = item.find('.msgBox');
    let user = msgBox.find('.userName').attr('rel');
    let content = msgBox.find('.msgCnt').html();
    let mediaWrap = msgBox.find('.multiMedia').find('.mediaWrap');
    let pubInfo = msgBox.find('.pubInfo').find('span');
    let postTime = pubInfo.find('.time').attr('rel');
    let client = pubInfo.find('.f').text();
    return co(function*() {
        let images = yield extractImages(mediaWrap);
        let post = new Post({
            content: content,
            when: postTime,
            source: {
                client: client,
                user: user,
                id: id,
                url: 'http://t.qq.com/p/t/' + id,
                from: 't.qq.com',
            },
            images: images,
        });
        return Promise.resolve(post);
    });
}

exports = module.exports = {
    importFromTecent: importFromTecent,
};