class Message {
    constructor(head, when, content, sourceType, localFlag) {
        this.head = head;
        this.when = when;
        this.content = content;
        this.sourceType = sourceType;
        this.localFlag = localFlag;
    }

    parse() {
        let keys = Message.splitBuffer(this.content);
        return keys;
    }

    static splitBuffer(buffer) {
        let keys = [];
        for (let i = 0; i < buffer.length - 2;) {
            let cmd = buffer[i++];
            let length = buffer[i++];
            let content = '';
            console.log('0x' + Message.numberToHex(cmd), length);
            if (cmd === 0x20) {
                i += 4;
                continue;
            }
            if (length > 0) {
                for (let j = 0; j < length; j++) {
                    let char = buffer[i++];
                    if(i >= buffer.length)
                        break;
                    content += Message.numberToHex(char);
                }
                content = Message.decodeUtf8(content);
                keys.push({cmd: cmd, content: content});

            }
        }
        return keys;
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
