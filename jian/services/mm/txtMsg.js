const Message = require('./message');
const moment = require('moment');

class TxtMessage extends Message {
    parse1() {
        let keys = super.parse();
        let txt = keys.find((pair) => {
            return pair.cmd === 42;
        });
        return {
            when: this.when,
            displayTime: moment(this.when * 1000).format('YYYY/MM/DD/'),
            content: txt.content,
        };
    }

    parse() {
        let buffer = this.content;
        let txt = null;
        let flag = null;
        for (let i = 0; i < buffer.length; i++) {
            let cmd = buffer[i];
            if (cmd === 0x2a) {
                let length = buffer[++i];
                if (length <= 0)
                    continue;
                let result = this.readBuffer(i + 1, length);
                txt = Message.decodeUtf8(result.result);
                flag = result.flag;
            }
        }
        return {
            displayTime: moment(this.when * 1000).format('YYYY/MM/DD/'),
            when: this.when,
            txt: txt,
            flag: flag,
        };
    }

    readSpecialTxt(start) {
        let result = '';
        for (let i = start + 1; i < this.content.length; i++) {
            let ch = this.content[i];
            if (ch === 0x32) {
                if (this.content[i + 1] === 0x1f)
                    break;
            }
            result += Message.numberToHex(ch);
        }
        return result;
    }

    readBuffer(start, length) {
        if (length <= 0)
            return null;
        let result = '';
        let flag = this.content[start];
        if (flag < 32) {
            result = this.readSpecialTxt(start);
        }
        else {
            flag = '';
            for (let i = 0; i < length; i++) {
                let index = start + i;
                if (index >= this.content.length) {
                    console.error('Index out of bound');
                    break;
                }
                let ch = this.content[index];

                result += Message.numberToHex(ch);
            }
        }

        return {
            result: result,
            flag: flag,
        };
    }
}

exports = module.exports = TxtMessage;