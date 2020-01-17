var mongoose = require('mongoose');

var Schema = mongoose.Schema

var BookReview = new Schema({
    isGoodReview: {type: Boolean, required: true },
    bookID : { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    userID: {type: String, max: 100},
    bookTitle: {type: String, max: 100},
    authorName: {type: String, max: 100},
    review: {type: String, max: 1000},
})

// Virtual 
BookReview
    .virtual('url')
    .get(function() {
        return '/book/' + this._id
    })

module.exports = mongoose.model('BookReview', BookReview)