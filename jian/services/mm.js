const sqlite = require("sqlite3").verbose();
const logger = require('log4js').getLogger();
const SnsMessage = require('./mm/snsMessage');
const Post = require('../models/post');
const request = require('request-promise');
const cheerio = require('cheerio');
const parseString = require('xml2js').parseString;
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
                        console.log(post);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        });
        logger.debug('Closing sqlite');
        db.close();
    }

    async parseContent(row) {
        let doc = new xmldoc.XmlDocument(row.contentXml);
        console.log(doc.valueWithPath("createTime"));
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
            msgType: doc.valueWithPath("ContentObject.contentStyle"),
            images: [],
            video: null,
        };
        let saved = await this.savePost(post);
        return saved;
    }

    async savePost(post) {
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
        let item = new Post(post);
        return item.save();
    }

    async extractImage(src, thumb, postTime) {
        let localSrc = await Spider.downloadImage(src, postTime);
        let localThumb = await Spider.downloadImage(thumb, postTime);
        return {
            thumb: localThumb,
            src: localSrc,
        };
    }
}

exports = module.exports = MmService;