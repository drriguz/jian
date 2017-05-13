const Message = require('./message');
const moment = require('moment');

class TxtMessage extends Message {
    parse() {
        super.parse();
        return {
            displayTime: moment(this.when * 1000).format('YYYY/MM/DD/'),
            stringSeq: this.stringSeq,
            wxId: this.wxId,
            when: this.when,
            txt: this.content,
            flag: '',
        };
    }
}

exports = module.exports = TxtMessage;