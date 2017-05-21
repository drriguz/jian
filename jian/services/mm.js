const sqlite = require("sqlite3").verbose();
const logger = require('log4js').getLogger();
const SnsMessage = require('./mm/snsMessage');
const Post = require('../models/post');
const request = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const xmldoc = require('xmldoc');


const Spider = require('./spider').Spider;

const querySql = 'select SnsInfo.*, SnsInfoXml.content as contentXml from SnsInfo ' +
    'left join SnsInfoXml on SnsInfo.stringSeq = SnsInfoXml.stringSeq ' +
    'where SnsInfo.type=? order by createTime desc ' +
    'limit ?';
const limit = 1000; // just for debug purpose
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
                this.parseContent(row)
                    .then(post => {
                        //console.log(post);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        });
        logger.debug('Closing sqlite');
        db.close();
    }

    static mapMimeType(msgType) {
        if (msgType == 1)
            return 'image/jpeg';
        if(msgType == 4)
            return 'audio/mpeg';
        if(msgType == 5)
            return 'video/mpeg';
        return 'unknown';
    }

    async parseContent(row) {
        let doc = new xmldoc.XmlDocument(row.contentXml);
        console.log(doc.toString());
        let contentObject = doc.descendantWithPath("ContentObject.mediaList");
        let type = doc.valueWithPath("ContentObject.contentStyle");
        let images = [];
        if (contentObject) {
            contentObject.eachChild(media => {
                let image = {
                    src: media.valueWithPath("url"),
                    thumb: media.valueWithPath("thumb"),
                    width: media.valueWithPath("size@width"),
                    height: media.valueWithPath("size@height"),
                    size: media.valueWithPath("size@totalSize"),
                    mimeType: MmService.mapMimeType(type),
                    srcRefer: media.valueWithPath("url"),
                    thumbRefer: media.valueWithPath("thumb"),
                    title: media.valueWithPath("title") || '',
                    description: media.valueWithPath("description") || '',
                };
                images.push(image);
            });
        }
        let post = {
            content: doc.valueWithPath("contentDesc"),
            when: doc.valueWithPath("createTime"),
            source: {
                client: 'Wechat',
                user: doc.valueWithPath("username"),
                id: doc.valueWithPath("id"),
                url: 'snsId:' + doc.valueWithPath("id"),
                from: 'Wechat',
            },
            msgType: type,
            medias: images,
            video: null,
        };
        console.log(post);
        post = await this.savePost(post);
        return post;
    }

    async savePost(post) {
        let postTime = new Date(post.when * 1000);
        if (post.msgType === 1) {
            let localImages = [];
            if (post.medias) {
                for (let i = 0; i < post.medias.length; i++) {
                    let img = post.medias[i];
                    let localImage = await this.extractImage(img, postTime);
                    localImages.push(localImage);
                }
            }
            post.medias = localImages;
        }
        let item = new Post(post);
        return item.save();
    }

    async extractImage(img, postTime) {
        let localSrc = await Spider.downloadImage(img.src, postTime);
        let localThumb = await Spider.downloadImage(img.thumb, postTime);
        return _.merge(img, {
            thumb: localThumb,
            src: localSrc,
        });
    }
}

exports = module.exports = MmService;