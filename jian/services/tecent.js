const Promise = require('bluebird');
const co = require('co');
const request = require('request-promise');
const cheerio = require('cheerio');

function main() {
    console.log('running!');
    co(function*() {
        let $ = yield fetch('http://t.qq.com/solever?gall=1');
        let t = $('#talkList').children('li').each((i, item) => {
            extractItem($, i, item);
        });
    }).catch(err => {
        console.error(err);
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

function extractItem($, i, item) {
    let id = $(item).attr('id');
    let msgBox = $(item).children('.msgBox');
    let user = msgBox.children('.userName').attr('rel');
    let content = msgBox.children('.msgCnt').html();
    let pictures = msgBox.children('.multiMedia').children('.mediaWrap').children('.picBox');
    pictures.find('a').each((i, item) => {
        console.log('picture:', $(item).attr('href'));
    });
    console.log(i, id, user, content);
}
main();