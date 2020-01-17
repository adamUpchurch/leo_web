var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var BugSchema = new Schema ({

    sentenceIndex: {type: Number, required: true },
    bookID : { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    completed: {type: Boolean, default: false},
    text: {type: String, max: 100},
    translation: {type: String, max: 100},
    userID: {type: String, max: 100},
    bookTitle: {type: String, max: 100},
    authorName: {type: String, max: 100},


});

// Virtual 
BugSchema
    .virtual('url')
    .get(function() {
        return '/bug/' + this._id
    })


module.exports = mongoose.model('Bug', BugSchema)