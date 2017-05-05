const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: String,
    when: Number,
    images: [
        {
            src: String,
            thumb: String,
        }
    ],
    source: {
        from: String,
        client: String,
        id: String,
        url: String,
        user: String,
    },
});

module.exports = mongoose.model('Post', postSchema);

