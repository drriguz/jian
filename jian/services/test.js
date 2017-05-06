const cheerio = require('cheerio');
const co = require('co');

let src = '<ul><li id="1">123</li><li id="2">234</li></ul>';


class Builder {
    constructor(html) {
        this.cheerio = cheerio.load(html);
        this.name = 'xx';
        const context = this;
        co(function*(){
            let c = yield fetch('xx');

            context.name = c;
            console.log('xxx', c, context.name);
        }).then();
        console.log('inited...');
    }

    test() {
        let $ = this.cheerio;
        console.log('->', $, this.name);
        let ul = $('ul');
        ul.find('li').map((i, ele) => {
            console.log($(ele).attr('id'));
        });
    }
}
function fetch(url){
    return Promise.resolve('hello!');
}
let b = new Builder(src);
b.test();

console.log('done:', b.name);