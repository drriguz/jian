class Message {
    constructor(head, when, buffer, sourceType, localFlag) {
        this.head = head;
        this.when = when;
        this.buffer = buffer;
        this.sourceType = sourceType;
        this.localFlag = localFlag;
    }

    parse() {
        let stringSeq = this.findFlag(0, 0x0a);
        if (!stringSeq) {
            console.error('Failed to find stringSeq');
            return;
        }
        this.stringSeq = Message.decodeUtf8(this.readFlag(stringSeq.position, stringSeq.length));
        let wxId = this.findFlag(stringSeq.position + stringSeq.length, 0x12);
        if (!wxId) {
            console.error('Failed to find wxId');
            return;
        }
        this.wxId = Message.decodeUtf8(this.readFlag(wxId.position, wxId.length));
        let content = this.findFlag(wxId.position + wxId.length, 0x2a);
        if (!content) {
            console.error('Failed to find content');
            return;
        }
        this.content = Message.decodeUtf8(this.readFlagTo(content.position, [0x32, 0x1f]));
    }

    findFlag(start, flag) {
        for (let i = start; i < this.buffer.length; i++) {
            let ch = this.buffer[i];
            if (ch === flag)
                return {
                    flag: flag,
                    length: this.buffer[i + 1],
                    position: i + 2,
                };
        }
        return null;
    }

    readFlag(start, length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            let index = start + i;
            if (index >= this.buffer.length) {
                console.error('Index out of bound');
                break;
            }
            let ch = this.buffer[index];
            result += Message.numberToHex(ch);
        }
        return result;
    }

    readFlagTo(start, endFlagArr) {
        let result = '';
        for (let i = start; i < this.buffer.length; i++) {
            let ch = this.buffer[i];
            let end = false;
            if (ch === endFlagArr[0]) {
                end = true;
                for (let j = 0; j < endFlagArr.length; j++) {
                    if (i + j >= this.buffer.length || this.buffer[i + j] !== endFlagArr[j])
                        end = false;
                }
                if (end) {
                    return result;
                }
            }
            result += Message.numberToHex(ch);
        }
        return null;
    }

    static numberToHex(num) {
        let hex = num.toString(16);
        if (hex.length !== 2)
            hex = '0' + hex;
        return hex;
    }

    static decodeUtf8(hexString) {
        let buffer = new Buffer(hexString, 'hex');
        return buffer.toString();
    }
}

exports = module.exports = Message;
