class Message {
    constructor(type, head, when, buffer, sourceType, localFlag) {
        this.type = type;
        this.head = head;
        this.when = when;
        this.buffer = buffer;
        this.sourceType = sourceType;
        this.localFlag = localFlag;
        this.lastIndex = 0;
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
        let flag = this.buffer[content.position];
        let contentHex = '';
        if (flag < 32) {
            console.log('Unknown mask found:', flag);
            this.contentMask = flag;
            contentHex = this.readFlagTo(content.position + 1, [0x32, 0x1f]);
        }
        else {
            contentHex = this.readFlag(content.position, content.length);
        }
        if (contentHex) {
            let contentBuffer = new Buffer(contentHex, 'hex');
            this.content = Message.decodeUtf8(contentHex);
            this.lastIndex = content.position + contentBuffer.length;
        }
        else {
            this.lastIndex = content.position;
        }
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

    findFlags(start, flagArr) {
        for (let i = start; i < this.buffer.length; i++) {
            let ch = this.buffer[i];
            if (ch === flagArr[0]) {
                let found = true;
                for (let j = 0; j < flagArr.length; j++) {
                    if (i + j >= this.buffer.length || this.buffer[i + j] !== flagArr[j]) {
                        found = false;
                        break;
                    }
                }
                if (found)
                    return i + flagArr.length;
            }
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
