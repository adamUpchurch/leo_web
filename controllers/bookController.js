var async = require('async');
var marked = require('marked');

const axios = require('axios')

var Book = require('../models/book'),
    Bug = require('../models/bug'),
    User = require('../models/user');

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
    list: (req, res, next) => {
        console.log("Rendering books!")
        Book.find({})
            .exec((err, list_books) => {
                if (err) { return next(err); }
                console.log('DOING IT!')
                res.render('book_list', { title: 'Book List', book_list: list_books})
            });
    },
    detail: (req, res) => {
        let id = req.params.id;
        Book.findById(id)
            .populate('bugs')
            .exec((err, book)=> {
                if (err) { return next(err); }
                console.log('Book detail')
                console.log(book)
                if(book.post){
                    var book = marked(book.post)
                    console.log('Book Post =====')
                    console.log(post)
                }

                res.render('book_detail', { title: 'Book Detail', book, bugs: book.bugs ? book.bugs : []})
            })
    },
    create_get: (req, res, next) => {
        res.render('book_form', {title: 'Book Form'})
    },
    create_post: [
        // Validate fields
        body('title', 'Title must not be empty').isLength({min: 1}).trim(),

        //Sanitize
        sanitizeBody('title').escape(),
        sanitizeBody('author').escape(),
        sanitizeBody('summary').escape(),
        sanitizeBody('cover').escape(),

        (req, res, next) => {
            const errors = validationResult(req);
            // Create a Book Project
            // Create a Book object with escaped/trimmed data and old id
            var req_book = req.body
            console.log(req_book)

            var book = new Book({
                title: req_book.title,
                author: req_book.author,
                summary: req_book.summary,
                cover: req_book.cover
            });

            var story = req_book.story
            book.save(err => {
                if(err) {res.render('book_form',  { title: 'Create Book', book: book, errors: errors.array()})}
                res.redirect('/books')
            })

            // axios.post('http://127.0.0.1:5000/traducir',{
            //     'book': book,
            //     'story': story
            //     })
            //     .then(resp => {
            //     // if no error with splitting, add to book object
            //     // save story

            //     book.story.en = resp.data.en
            //     book.story.es = resp.data.es

            //     book.save(err => {
            //         if(err) {res.render('book_form',  { title: 'Create Book', book: book, errors: errors.array()})}
            //         res.redirect('/books')
            //     })
            // }).catch(error => {
            //     // error with splitting - currently not return error to user
            //     console.log('=================== Error=======================')
            //     console.log(error.response.status)
            //     console.log(error.response.statusText)
            //     console.log('=================== Error=======================')

            //     res.render('book_form',  { title: 'Create Book', book: book})
            // });
        }
    ],
    translate_get: (req, res, next) => {
        let id = req.params.id;
        Book.findById(id)
            .exec((err, book)=> {
                if (err) { return next(err); }
                console.log('Book Translate')
                console.log(book)
                if(book.post){
                    var book = marked(book.post)
                    console.log('Book Translate Post =====')
                    console.log(post)
                }

                res.render('book_Translate', { title: 'Book Translate', book})
            })    },
    translate_post: (req, res, next) => {
        let id = req.params.id;
        Book.findById(id)
            .exec((err, book)=> {
                
                if (err) { return next(err); }
                var textToTranslate = book.story.en
                axios.post('http://127.0.0.1:5000/translate',{
                    'text_to_translate': textToTranslate,
                    })
                    .then(resp => {
                    // if no error with splitting, add to book object
                    // save story
        
                    book.story.es = resp.data
                    book.save(err => {
                        if(err) {res.render('book_translate',  { title: 'Translate Book', book: book, errors: errors.array()})}
                        res.redirect(book.url)
                    })
                }).catch(error => {
                    // error with splitting - currently not return error to user
                    console.log('=================== Error=======================')
                    console.log(error.response.status)
                    console.log(error.response.statusText)
                    console.log('=================== Error=======================')
        
                    res.render('book_translate',  { title: 'Translate Book', book: book})
                });
            })

    },
    delete_get: (req, res) => {
        async.parallel({
            book: callback => {
                Book.findById(req.params.id).exec(callback)
            },
        }, (error, results) => {
            if(error) return next(error);
            console.log(results)
            if(results.book == null) res.redirect('/books')
            res.render('book_delete', {title: 'Delete Book', book: results.book})
        })
    },
    delete_post: (req, res) => {
        async.parallel({
            book: callback => {
                Book.findById(req.body.bookid).exec(callback)
            }
        }, (error, results) => {
            if(error) return next(error)
            Book.findByIdAndRemove(req.body.bookid, function deleteBook(error) {
                if(error) return next(error)
                res.redirect('/books')
            })
        })
    },
    update_get: (req, res) => {
        async.parallel({
            book: function(callback){
                Book.findById(req.params.id).exec(callback)
            },
        },
            function(error, results){
                if(error) { return next(error)}
                if (results.book == null) { // No book to return
                    var err = new Error('Book not found')
                    err.status = 404;
                    return next(err)
                }
                //Success
                // res.json(results)
                res.render('book_form', {title: 'Update Book', book: results.book})
            })
    },
    update_post: [
        (req, res, next) => {
            next();
        },
        // Validate fields
        body('title', 'Title must not be empty').isLength({min: 1}).trim(),
        body('post', 'Business plan must not be empty').isLength({min: 1}).trim(),

        //Sanitize
        sanitizeBody('title').escape(),
        sanitizeBody('subtitle').escape(),
        sanitizeBody('summary').escape(),
        sanitizeBody('story').escape(),

        // Process request after validation and sanitization
        (req, res, next) => {
            const errors = validationResult(req);
            console.log('errors: ' + errors)
            //Create a Book object with escaped/trimmed data and old id
            console.log('POSTING UPDATE')
            console.log(req.body)

            var book = new Book({
                title: req_book.title,
                author: req_book.author,
                summary: req_book.summary,
                cover: req_book.cover,
                _id: req.params.id //This is required, or a new ID will be assigned.
            });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized value/error messages
            res.render('book_form', {title: 'Update Book', book: book, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record
            Book.findByIdAndUpdate(book._id, book, {}, function(error, thebook) {
                if(error) {return next(error)}
                // Update successful - redirect to book detail
                res.redirect(book.url)
            })
        }
        }
    ]
}
