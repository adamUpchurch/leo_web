var User = require('../models/user'),
    Book = require('../models/book'),
    async   = require('async');

const   { body,validationResult } = require('express-validator/check'),
        { sanitizeBody } = require('express-validator/filter');


module.exports = {
    list: (req, res, next) => {
        User.find()
            .exec((err, list_users)=> {
                if(err) { return next(err)}
                res.render('user_list', {title: 'Users', user_list: list_users})
            })
    },
    detail: (req, res, next) => {
        let id = req.params.id;
        async.parallel({
            user: function(cb){
                User.findById(id)
                    .exec(cb)
            },
            book: function(cb){
                Book.find({})
                    .exec(cb)
            },
        }, function(err, result) {
            if(err) { return next(err)}
            console.log(result)
            res.render('user_detail', {title: 'User', user: result.user, books: result.book})
        })
        },
    create_get: (req, res) => {
        res.render('user_form', {title: 'Create User'})
    },
    create_post: [
        // Validate that the name field is not empty.
        body('first_name', 'User name required').isLength({ min: 1 }).trim()
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
        body('family_name', 'User name required').isLength({ min: 1 }).trim()
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),

        sanitizeBody('first_name').escape(),
        sanitizeBody('family_name').escape(),
        sanitizeBody('personality').escape(),

        (req, res, next) => {
            console.log('Creating new user!')
            console.log(req.body)
            // Extract the validation errors from a request.
            const errors = validationResult(req);
            const newUser = req.body
            // Create a user object with escaped & trimmed data
            var user = new User({
                first_name: newUser.first_name,
                family_name: newUser.family_name,
                personality: newUser.personality
                });

            if(!errors.isEmpty()) {
                //Error. Render form again with sanitized values/error message
                res.render('user_form', { title: 'Create User', user: user, errors: errors.array()});
                return;
            }
            else {
                // Data from form is valid
                user.save(err => {
                    if(err) {return next(err)}
                    res.redirect(user.url)
                })
            }
        }

    ],
    delete_get: (req, res) => {
        async.parallel({
            user: function(callback){
                User.findById(req.params.id).exec(callback)
            },
            books: function(callback){
                Book.find({'user': req.params.id}).exec(callback)
            },
        }, function(error, results) {
            if(error) {return next(error)}
            if (results.user == null) {
                res.redirect('/users')
            }
            res.render('user_delete', {title: 'Delete User', user: results.user, books: results.books})
        })
    },
    delete_post: (req, res, next) => {
        async.parallel({
            user: function(callback){
                User.findById(req.body.userid).exec(callback)
            },
        },  (error, results) => {
            if(error) {            
                return next(error)}
            else {
                User.findByIdAndRemove(req.body.userid, function deleteUser(error) {
                    if(error) {                        
                        return next(error)
                    }
                    res.redirect('/users')
                })
            }
        })
    },
    update_get: (req, res) => {
        async.parallel({
            user: function(callback){
                User.findById(req.params.id).exec(callback)
            },
            books: function(callback){
                Book.find({'user': req.params.id}).exec(callback)
            },
        }, function(error, results) {
            if(error) {return next(error)}
            if (results.user == null) {
                res.redirect('/users')
            }
            res.render('user_form', {title: 'Update User', user: results.user, books: results.books})
        })
    },
    update_post: [
            // Validate that the name field is not empty.
            body('first_name', 'User name required').isLength({ min: 1 }).trim()
                .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
            body('family_name', 'User name required').isLength({ min: 1 }).trim()
                .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    
            sanitizeBody('first_name').escape(),
            sanitizeBody('family_name').escape(),
            sanitizeBody('personality').escape(),
            sanitizeBody('linkedin_url').escape(),
            sanitizeBody('portfolio_url').escape(),
    
            (req, res, next) => {
                console.log('Creating new user!')
                console.log(req.body)
                // Extract the validation errors from a request.
                const errors = validationResult(req);
                const newUser = req.body
                // Create a user object with escaped & trimmed data
                var user = new User(
                    { 
                    first_name: newUser.first_name,
                    family_name: newUser.family_name,
                    linkedin_url: newUser.linkedin_url,
                    portfolio_url: newUser.portfolio_url,
                    personality: newUser.personality,
                    _id:req.params.id //This is required, or a new ID will be assigned!
                    });
    
                if(!errors.isEmpty()) {
                    //Error. Render form again with sanitized values/error message
                    res.render('user_form', { title: 'Create User', user: user, errors: errors.array()});
                    return;
                }
                else {
                    // Data from form is valid. Update the record.
                    User.findByIdAndUpdate(user._id, user, {}, function (err,UpdatedUser) {
                        if (err) { return next(err); }
                            // Successful - redirect to book detail page.
                            res.redirect(UpdatedUser.url);
                        });
                }
            }
        ],
}