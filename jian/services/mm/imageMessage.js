const Message = require('./message');
const moment = require('moment');

const POST_TYPES = {
    IMAGE_POST: 1,
    ASCI_POST: 2,
    LINK_SHARE: 3,
    MUSIC_SHARE: 4,
    VIDEO_SHARE: 5,
    VIDEO_POST: 15,
};
class ImageMessage extends Message {
    parseImages() {
        this.images = [];
        for (let l = 0; l < 9; l++) {
            let imageIndex = this.findFlags(this.lastIndex, [0x10, 0x02, 0x1a, 0x00]);
            if (!imageIndex) {
                break;
            }
            let image = this.findFlag(imageIndex, 0x22);
            if (!image) {
                console.error('Failed to find image');
                break;
            }
            let thumb = this.findFlag(image.position + image.length, 0x32);
            if (!thumb) {
                console.error('Failed to find thumb');
                break;
            }
            let url = Message.decodeUtf8(this.readFlag(image.position, image.length));
            let thumbUrl = Message.decodeUtf8(this.readFlag(thumb.position, thumb.length));
            this.images.push({
                image: url,
                thumb: thumbUrl,
            });
            this.lastIndex = thumb.position + thumb.length;
        }
    }

    parseLinks() {
        for (let i = 0; i < 10; i++) {
            let url = this.findFlag(this.lastIndex, 0x22);
            if (!url) {
                console.error('Failed to find link url!');
                break;
            }
            this.lastIndex = url.position;
            if (url.length === 0) continue;
            let flag = this.buffer[url.position];
            if (flag < 32) {
                url.position = url.position + 1;
                this.linkMask = flag;
            }
            let linkUrl = this.readFlag(url.position, url.length);
            linkUrl = Message.decodeUtf8(linkUrl);
            this.link = linkUrl;
            break;
        }
    }

    parse() {
        super.parse();
        if (this.type === POST_TYPES.IMAGE_POST) {
            this.parseImages();
        }
        if (this.type === POST_TYPES.LINK_SHARE) {
            this.parseLinks();
        }
        return {
            displayTime: moment(this.when * 1000).format('YYYY/MM/DD/'),
            stringSeq: this.stringSeq,
            wxId: this.wxId,
            when: this.when,
            txt: this.content || '',
            mask: this.contentMask || '',
            images: this.images || [],
            link: this.link || '',
            linkMask: this.linkMask || '',
            type: this.type,
            flag: '',
            raw: this.buffer.toString('hex'),
        };
    }
}

exports = module.exports = ImageMessage;