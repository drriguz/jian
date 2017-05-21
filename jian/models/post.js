const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: String,
    when: Number,
    medias: [
        {
            src: String,
            width: Number,
            height: Number,
            size: Number,
            thumb: String,
            mimeType: String,
            srcRefer: String,
            thumbRefer: String,
            title: String,
            description: String,
        }
    ],
    source: {
        from: String,
        client: String,
        id: String,
        url: String,
        user: String,
    },
    msgType: Number,
});

module.exports = mongoose.model('Post', postSchema);

