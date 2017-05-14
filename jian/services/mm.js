const sqlite = require("sqlite3").verbose();
const tstdb = '/Users/hfli/workspace/tmp/SnsMicroMsg.db';
const db = new sqlite.Database(tstdb);
const Message = require('./mm/message');
const SnsMessage = require('./mm/snsMessage');

db.serialize(() => {
    db.each('select * from SnsInfo where type=? order by createTime desc', '5', (err, row) => {
        // if (row.type !== 1)
        //     return;
        let item = new SnsMessage(row.type, row.head, row.createTime, row.content, row.sourceType, row.localFlag);
        try {
            let msg = item.parse();
            console.log(msg);
        }
        catch (err) {
            console.error('Failed to parse:', row.stringSeq, row.content.toString('hex'));
            console.error(err);
        }
    });
});

db.close();