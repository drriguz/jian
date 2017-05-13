const sqlite = require("sqlite3").verbose();
const tstdb = '/Users/hfli/workspace/tmp/SnsMicroMsg.db';
const db = new sqlite.Database(tstdb);
const Message = require('./mm/message');
const TxtMessage = require('./mm/txtMsg');

db.serialize(() => {
    db.each('select * from SnsInfo where type=? order by createTime desc', '2', (err, row) => {
        let item = new TxtMessage(row.head, row.createTime, row.content, row.sourceType, row.localFlag);
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