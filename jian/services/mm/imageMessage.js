const Message = require('./message');
const moment = require('moment');

class ImageMessage extends Message {
    parse() {
        super.parse();
        if (this.type === 1) {
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
        return {
            displayTime: moment(this.when * 1000).format('YYYY/MM/DD/'),
            stringSeq: this.stringSeq,
            wxId: this.wxId,
            when: this.when,
            txt: this.content,
            images: this.images,
            flag: '',
        };
    }
}

exports = module.exports = ImageMessage;