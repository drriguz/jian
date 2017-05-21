const request = require('request-promise');
const cheerio = require('cheerio');
const logger = require('log4js').getLogger();
const fs = require('fs');
const fsExtra = require('fs-extra');
const moment = require('moment');
const path = require('path');
const Promise = require('bluebird');

const Post = require('../models/post');
const dir_prefix = 'postpic/';
const uuid = require('uuid/v4');
const md5 = require('md5');

class Spider {
    constructor($, from) {
        this.$ = $;
        this.from = from;
    }

    static async fetch(url) {
        let options = {
            url: url,
            transform: (body) => {
                return cheerio.load(body, {decodeEntities: false});
            }
        };
        return await request(options);
    }

    static download(uri, filename, callback) {
        request.head(uri, (err, res, body) => {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    }

    static async downloadImage(url, postTime, ext) {
        if (!url) {
            logger.error('Unknown url:', postTime);
            return null;
        }
        let arr = url.split('/');
        let extension = ext || '.jpg';
        let fileName = arr[arr.length - 2] + '-' + arr[arr.length - 1] + extension;
        if (extension === '.mp4') {
            fileName = md5(fileName) + '.mp4';
        }
        let dir = dir_prefix + moment(postTime).format('YYYY/MM/DD/');
        let savePath = path.join(__dirname, '../public', dir + fileName);
        let saveDir = path.join(__dirname, '../public', dir);
        fsExtra.ensureDirSync(saveDir);
        let relPath = dir + fileName;
        if (fs.existsSync(savePath)) {
            logger.debug('Skip download:', fileName);
            return relPath;
        }
        logger.debug('downloading image from ', url);
        const downloadPromise = Promise.promisify(this.download);
        await downloadPromise(url, savePath);
        return relPath;
    }
}

class TecentSpider extends Spider {
    constructor($) {
        super($, 't.qq.com');
    }

    extractAll() {
        let $ = this.$;
        let self = this;
        $('#talkList').children('li').each((i, element) => {
            self.extract($(element)).then(post => {
                if (!post) return;
                self.savePost(post)
                    .then(result => {
                        logger.debug('saved:', result._id);
                    })
                    .catch(err => {
                        logger.error(err);
                    });
            });
        });
    }

    async extract(li) {
        const self = this;
        let id = li.attr('id');
        let exists = await this.checkPost(id);
        if (exists) {
            logger.debug('skip existing post:', id);
            return null;
        }
        logger.debug('fetching post:', id);
        let msgBox = li.find('.msgBox');
        let user = msgBox.find('.userName').attr('rel');

        let msgCnt = msgBox.find('.msgCnt');
        let contentIcons = msgCnt.find('img');
        for (let i = 0; i < contentIcons.length; i++) {
            let icon = contentIcons.get(i);
            let $ = this.$;
            $(icon).attr('src', $(icon).attr('crs'));
        }
        let content = msgCnt.html();
        let mediaWrap = msgBox.find('.multiMedia').find('.mediaWrap');
        let pubInfo = msgBox.find('.pubInfo').find('span');
        let timestamp = pubInfo.find('.time').attr('rel');
        let postTime = new Date(timestamp * 1000);
        let client = pubInfo.find('.f').text();
        let images = this.findImages(mediaWrap);
        let localImages = [];
        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            let localImage = await self.extractImage(img, postTime);
            localImages.push(localImage);
        }
        let video = this.findVideo(mediaWrap);
        let post = {
            content: content,
            when: timestamp,
            source: {
                client: client,
                user: user,
                id: id,
                url: 'http://t.qq.com/p/t/' + id,
                from: this.from,
            },
            images: localImages,
            video: video,
        };
        return post;
    }

    async extractImage(a, postTime) {
        let src = a.attr('href');
        let img = a.find('img').attr('crs');
        let localSrc = await Spider.downloadImage(src, postTime);
        let localThumb = await Spider.downloadImage(img, postTime);
        return {
            thumb: localThumb,
            src: localSrc,
        };
    }

    findImages(mediaWrap) {
        if (mediaWrap.length <= 0) return [];
        let pictures = [];
        let $ = this.$;
        let pictureGroup = mediaWrap.find('.tl_imgGroup');
        if (pictureGroup.length > 0) {
            logger.debug('find picture group.');
            pictureGroup.find('.tl_imgGroup_item').each((i, element) => {
                let a = $(element).find('a');
                pictures.push(a);
            });
        }
        else {
            let a = mediaWrap.find('.picBox').find('a');
            if (a.length > 0) {
                pictures.push(a);
                logger.debug('find picture.');
            }
        }
        return pictures;
    }

    findVideo(mediaWrap) {
        if (mediaWrap.length <= 0) return [];
        let a = mediaWrap.find('.videoBox').find('.vWrap').find('a');
        if (a.length <= 0)
            return null;
        logger.debug('=>find video.', a.attr('href'));
        return a.attr('href');
    }

    async savePost(post) {
        let item = new Post(post);
        return item.save();
    }

    async checkPost(id) {
        let post = await Post.findOne({'source.id': id});
        return !!post;
    }

    getNextPage(base, page) {
        let $ = this.$;
        let pageBtn = $('#pageNav').children('a');
        let paramIndex = base.indexOf('?');
        if (paramIndex) base = base.substr(0, paramIndex);
        if (pageBtn.length > 0) {
            for (let i = 0; i < pageBtn.length; i++) {
                let theBtn = $(pageBtn.get(i));

                if (parseInt(theBtn.text()) === page) {
                    return base + theBtn.attr('href');
                }
            }
        }
        return null;
    }
}
function importFromTecent(url, page, min, max) {
    if (!page) page = 1;
    logger.debug('=>page:', page, url);
    if (page > max) {
        logger.debug('stoped');
        return;
    }
    Spider.fetch(url).then($ => {
        let spider = new TecentSpider($);
        let next = spider.getNextPage(url, page + 1);
        if (next) {
            importFromTecent(next, page + 1, min, max);
        }
        else {
            logger.debug('< No more pages.');
        }
        if (page < min || page > max) {
            logger.debug('=> skip fetching', page);
        } else {
            logger.debug('====> fetching:', page);
            spider.extractAll();
        }
    });
}
exports = module.exports = {
    importFromTecent: importFromTecent,
    Spider: Spider,
};
