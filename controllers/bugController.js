var async = require('async');
var marked = require('marked');

const axios = require('axios')

var Bug = require('../models/bug');
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
    // List all the bugs in Database
    list: (req, res, next) => {
        console.log("Rendering Translation Bug List!")
        
        // Finds all bugs
        Bug.find({"completed": false})
            .exec((err, bug_list) => {
                if (err) { return next(err); }
                // If no error, renders Bug List view with bug list
                res.render('bug_list', { title: 'Bugs List', bug_list})
            });
    },

    // View into more detail of a bug
    detail: (req, res) => {
        let id = req.params.id;
        // Find bug by ID
        Bug.findById(id)
            // .populate('bookID')
            .exec((err, bug)=> {
                if (err) { return next(err); }
                console.log('Bug detail')
                console.log(bug)

                // If no error, render Bug Detail with bug
                res.render('bug_detail', { title: 'Bug Detail', bug})
            })
    },

    // Render create bug form for manually bug creation
    // Idk when this would ever be done.. might as well fix the bug if you're creating a bug manually, right?
    create_get: (req, res, next) => {
        res.render('bug_form', {title: 'Bug Form'})
    },
    create_post: [
        // Validate field
        body('sentenceIndex', 'Sentence Index must not be empty').isLength({min: 1}).trim(),
        body('bookID', 'Book ID must be Present').isLength({min: 1}).trim(),

        // Sanitize
        sanitizeBody('text').escape(),
        sanitizeBody('translation').escape(),
        sanitizeBody('bookTitle').escape(),
        sanitizeBody('authorName').escape(),
        // sanitizeBody('userID').escape(),

        (req, res, next) => {
            console.log('hostname', req.hostname)
            console.log(req)
            const errors = validationResult(req);

            // Create a Book Project
            // Create a Book object with escaped/trimmed data and old id
            var req_bug = req.body
            console.log(req_bug)

            // Create new Bug from data
            var bug = new Bug({
                sentenceIndex: req_bug.sentenceIndex,
                bookID: req_bug.bookID,
                text: req_bug.text ? req_bug.text : '',
                translation: req_bug.translation ? req_bug.translation : '',
                userID: req_bug.userID ? req_bug.userID : 0,
                bookTitle: req_bug.bookTitle ? req_bug.bookTitle : '',
                authorName: req_bug.authorName ? req_bug.authorName : '',
            });
            
            // Save bug to Database - MongoDB
            bug.save(err => {
                if(req.hostname.includes('localhost')){
                    if(err) {res.render('bug',  { title: 'Create Bug', bug, errors: errors.array()})}
                    res.redirect('/bugs')
                }
                return "thanks for the bug report!"
            })
        }
    ],
    tag_post: [
        // Validate field
        body('sentenceIndex', 'Sentence Index must not be empty').isLength({min: 1}).trim(),
        body('bookID', 'Book ID must be Present').isLength({min: 1}).trim(),

        // Sanitize
        sanitizeBody('text').escape(),
        sanitizeBody('translation').escape(),
        sanitizeBody('bookTitle').escape(),
        sanitizeBody('authorName').escape(),
        // sanitizeBody('userID').escape(),

        (req, res, next) => {
            console.log('hostname', req.hostname)
            const errors = validationResult(req);
            // Create a Book Project
            // Create a Book object with escaped/trimmed data and old id
            var req_bug = req.body
            console.log(req_bug)

            // Create new Bug from data
            var bug = new Bug({
                sentenceIndex: req_bug.sentenceIndex,
                bookID: req_bug.bookID,
                text: req_bug.text ? req_bug.text : '',
                translation: req_bug.translation ? req_bug.translation : '',
                userID: req_bug.userID ? req_bug.userID : 0,
                bookTitle: req_bug.bookTitle ? req_bug.bookTitle : '',
                authorName: req_bug.authorName ? req_bug.authorName : '',
            });
            
            // Save bug to Database - MongoDB
            bug.save(err => {
                console.log(err)
                return "thanks for the bug report!"
            })
        }
    ],
    // Delete bug!!
    delete_post: (req, res) => {
        console.log(`Deleting book._id : ${req.params.id}`)
        Bug.findByIdAndRemove(req.params.id, function deleteBook(error) {
            if(error) return next(error)
            res.redirect('/bugs')
        })
    },
    // Get Update Form
    update_get: (req, res) => {
        async.parallel({
            bug: function(callback){
                Bug.findById(req.params.id).exec(callback)
            },
        },
            function(error, results){
                if(error) { return next(error)}
                if (results.bug == null) { // No book to return
                    var err = new Error('Bug not found')
                    err.status = 404;
                    return next(err)
                }
                //Success
                // res.json(results)
                res.render('bug_form', {title: 'Update Bug', bug: results.bug})
            })
    },

    // Post Bug Update back to database
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

            var req_bug = req.body
            console.log(req_bug)

            // Create new Bug from data
            var bug = new Bug({
                sentenceIndex: req_bug.sentenceIndex,
                bookID: req_bug.bookID,
                text: req_bug.title ? req_bug.title : '',
                translation: req_bug.translation ? req_bug.translation : '',
                userID: req_bug.title ? req_bug.title : 0,
                bookTitle: req_bug.bookTitle ? req_bug.bookTitle : '',
                authorName: req_bug.authorName ? req_bug.authorName : '',
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized value/error messages
            res.render('bug_form', {title: 'Update Bug', bug, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record
            Bug.findByIdAndUpdate(bug._id, book, {}, function(error, theBug) {
                if(error) {return next(error)}
                // Update successful - redirect to book detail
                res.redirect(bug.url)
            })
        }
        }
    ],
    // Delete bug!!
    complete_post: (req, res) => {
        async.parallel({
            bug: callback => {
                Bug.findById(req.params.id).exec(callback)
            }
        }, (error, results) => {
            if(error) return next(error)
            Bug.findByIdAndUpdate(req.params.id, {"$set":{"completed": true}}, {}, function(error, theBug) {
                if(error) {return next(error)}
                // Update successful - redirect to book detail
                res.redirect('/bugs')
            })
        })
    },
}
