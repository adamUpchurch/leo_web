var async = require('async');
var marked = require('marked');

const axios = require('axios')

var BookReview = require('../models/bookReview');
var Book = require('../models/book');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

module.exports = {
    index: (req, res) => {
        async.parallel({
            book_count: function(cb) {
                console.log('nothing')
            },
        }, function(err, results) {
            res.render('book', { title: 'book', error: err, data: results });

        } 
        )
    },
    // List all the bookReviews in Database
    list: (req, res, next) => {
        console.log("Rendering BookReview List!")
        
        // Finds all bookReviews
        BookReview.find({})
            .exec((err, bookReview_list) => {
                if (err) { return next(err); }
                // If no error, renders BookReview List view with bookReview list
                res.render('bookReview_list', { title: 'BookReviews List', bookReview_list})
            });
    },

    // View into more detail of a bookReview
    detail: (req, res) => {
        let id = req.params.id;
        // Find bookReview by ID
        BookReview.findById(id)
            // .populate('bookID')
            .exec((err, bookReview)=> {
                if (err) { return next(err); }
                console.log('Rendering BookReview detail')
                console.log(bookReview)

                // If no error, render BookReview Detail with bookReview
                res.render('bookReview_detail', { title: 'BookReview Detail', bookReview})
            })
    },

    // Render create bookReview form for manually bookReview creation
    // Idk when this would ever be done.. might as well fix the bookReview if you're creating a bookReview manually, right?
    create_get: (req, res, next) => {
        res.render('bookReview_form', {title: 'BookReview Form'})
    },
    create_post: [

        // Sanitize
        sanitizeBody('text').escape(),
        sanitizeBody('bookID').escape(),
        sanitizeBody('bookTitle').escape(),
        sanitizeBody('authorName').escape(),
        // sanitizeBody('userID').escape(),

        (req, res, next) => {
            const errors = validationResult(req);

            // Create a Book Project
            // Create a Book object with escaped/trimmed data and old id
            var req_bookReview = req.body
            console.log(req_bookReview)

            // Create new BookReview from data
            var bookReview = new BookReview({
                isGoodReview: req_bookReview.isGoodReview,
                bookID: req_bookReview.bookID,
                userID: req_bookReview.userID ? req_bookReview.userID : 0,
                bookTitle: req_bookReview.bookTitle ? req_bookReview.bookTitle : '',
                authorName: req_bookReview.authorName ? req_bookReview.authorName : '',
            });
            
            // Save bookReview to Database - MongoDB
            bookReview.save(err => {
                if(req.hostname.includes('localhost')){
                    if(err) {res.render('bookReview',  { title: 'Create BookReview', bookReview, errors: errors.array()})}
                    res.redirect('/bookReviews')
                }
                return "thanks for the book report!"
            })
        }
    ],
    // Delete bookReview!!
    delete_post: (req, res) => {
        console.log(`Deleting book._id : ${req.params.id}`)
        BookReview.findByIdAndRemove(req.params.id, function deleteBook(error) {
            if(error) return next(error)
            res.redirect('/bookReviews')
        })
    },
    // Get Update Form
    update_get: (req, res) => {
        async.parallel({
            bookReview: function(callback){
                BookReview.findById(req.params.id).exec(callback)
            },
        },
            function(error, results){
                if(error) { return next(error)}
                if (results.bookReview == null) { // No book to return
                    var err = new Error('BookReview not found')
                    err.status = 404;
                    return next(err)
                }
                //Success
                // res.json(results)
                res.render('bookReview_form', {title: 'Update BookReview', bookReview: results.bookReview})
            })
    },

    // Post BookReview Update back to database
    update_post: [
        (req, res, next) => {
            next();
        },
        // Validate fields
        body('sentenceIndex', 'Sentence Index must not be empty').isLength({min: 1}).trim(),
        body('bookID', 'Book ID must be Present').isLength({min: 1}).trim(),

        //Sanitize
        sanitizeBody('text').escape(),
        sanitizeBody('translation').escape(),
        sanitizeBody('bookTitle').escape(),
        sanitizeBody('authorName').escape(),
        sanitizeBody('userID').escape(),

        // Process request after validation and sanitization
        (req, res, next) => {
            const errors = validationResult(req);
            console.log('errors: ' + errors)
            //Create a Book object with escaped/trimmed data and old id
            console.log('POSTING UPDATE')

            var req_bookReview = req.body
            console.log(req_bookReview)

            // Create new BookReview from data
            var bookReview = new BookReview({
                bookID: req_bookReview.bookID,
                isGoodReview: req_bookReview.isGoodReview,
                bookID: req_bookReview.bookID,
                userID: req_bookReview.userID ? req_bookReview.userID : 0,
                bookTitle: req_bookReview.bookTitle ? req_bookReview.bookTitle : '',
                authorName: req_bookReview.authorName ? req_bookReview.authorName : '',
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized value/error messages
            res.render('bookReview_form', {title: 'Update BookReview', bookReview, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record
            BookReview.findByIdAndUpdate(bookReview._id, book, {}, function(error, theBookReview) {
                if(error) {return next(error)}
                // Update successful - redirect to book detail
                res.redirect(bookReview.url)
            })
        }
        }
    ],
    // Delete bookReview!!
    complete_post: (req, res) => {
        async.parallel({
            bookReview: callback => {
                BookReview.findById(req.params.id).exec(callback)
            }
        }, (error, results) => {
            if(error) return next(error)
            BookReview.findByIdAndUpdate(req.params.id, {"$set":{"completed": true}}, {}, function(error, theBookReview) {
                if(error) {return next(error)}
                // Update successful - redirect to book detail
                res.redirect('/bookReviews')
            })
        })
    },
}
