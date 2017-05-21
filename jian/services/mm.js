const sqlite = require("sqlite3").verbose();
const logger = require('log4js').getLogger();
const SnsMessage = require('./mm/snsMessage');
const Post = require('../models/post');
const request = require('request-promise');
const cheerio = require('cheerio');
const parseString = require('xml2js').parseString;

const Spider = require('./spider').Spider;

const querySql = 'select SnsInfo.*, SnsInfoXml.content as contentXml from SnsInfo ' +
    'left join SnsInfoXml on SnsInfo.stringSeq = SnsInfoXml.stringSeq ' +
    'where SnsInfo.type=? order by createTime desc ' +
    'limit ?';
const limit = 1; // just for debug purpose
class MmService {
    constructor(dbPath, msgType) {
        this.dbPath = dbPath;
        this.msgType = msgType;
        logger.debug('Config:', dbPath, msgType);
    }


    async extractPosts() {
        logger.debug('Loading data...');
        let db = new sqlite.Database(this.dbPath);
        db.serialize(() => {
            db.each(querySql, this.msgType, limit, (err, row) => {
                if (err) {
                    logger.error(err);
                    return;
                }

                logger.debug('=>', row.snsId);
                let item = new SnsMessage(row.type, row.head, row.createTime, row.content, row.sourceType, row.localFlag);
                try {
                    let msg = item.parse();
                    let post = this.makePost(row.snsId, msg);
                    this.savePost(post, msg)
                        .then(result => {
                            logger.debug('saved:', result._id);
                        })
                        .catch(err => {
                            logger.error(err);
                        });
                }
                catch (err) {
                    logger.error('Failed to parse:', row.stringSeq, row.content.toString('hex'));
                    logger.error(err);
                }
            });
        });
        logger.debug('Closing sqlite');
        db.close();
    }

    async parseContent(row){

        let contentJson = await parseString(row.contentXml);
        console.log(contentJson);
    }
    async savePost(post, msg) {
        post = await this.normalizePost(post, msg);
        let localImages = [];
        let postTime = new Date(post.when * 1000);
        if (post.images) {
            for (let i = 0; i < post.images.length; i++) {
                let img = post.images[i];
                let localImage = await this.extractImage(img.src, img.thumb, postTime);
                localImages.push(localImage);
            }
        }
        post.images = localImages;
        if (post.video) {
            post.video = await this.extractVideo(post.video, postTime);
        }
        let item = new Post(post);
        return item.save();
    }

    async fetchLinkTitle(url) {
        let $ = await Spider.fetch(url);
        return $('title').text();
    }

    async normalizePost(post, msg) {
        if (post.msgType === 5 || post.msgType === 4 || post.msgType === 3) {
            let linkTitle = await this.fetchLinkTitle(msg.link);
            if (!linkTitle || linkTitle === '')
                linkTitle = 'Link';
            post.content += '<br/><a href="' + msg.link + '" alt="link">' + linkTitle + '</a>';
        }
        return post;
    }

    makePost(snsId, msg) {
        let post = {
            content: msg.txt,
            when: msg.when,
            source: {
                client: 'Wechat',
                user: msg.wxId,
                id: msg.stringSeq,
                url: 'snsId:' + snsId,
                from: 'Wechat',
            },
            msgType: msg.type,
            images: msg.images,
            video: msg.video,
        };
        return post;
    }

    async extractImage(src, thumb, postTime) {
        let localSrc = await Spider.downloadImage(src, postTime);
        let localThumb = await Spider.downloadImage(thumb, postTime);
        return {
            thumb: localThumb,
            src: localSrc,
        };
    }

    async extractVideo(link, postTime) {
        if (link.indexOf('(') >= 0) {
            link = link.split('(')[0];
        }
        logger.debug('video:', link);
        let localMp4 = await Spider.downloadImage(link, postTime, '.mp4');
        return localMp4;
    }
}

exports = module.exports = MmService;