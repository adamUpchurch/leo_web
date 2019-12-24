var mongoose = require('mongoose');

var Schema = mongoose.Schema

var BookSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String},
    author: {type: String},
    story: {
        en: [{type: String}],
        es: [{type: String}]
    },
    difficulty: {type: Number, min: 1, max: 5},
    cover: {type: String},
    farthest_read: {type: Number},
    recently_read: {type: Number},
    last_read: {type: Date},
    bugs: [{ type: Schema.Types.ObjectId, ref: 'Bug', default: []}]
})

// Virtual 
BookSchema
    .virtual('url')
    .get(function() {
        return '/book/' + this._id
    })

module.exports = mongoose.model('Book', BookSchema)