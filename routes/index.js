var express   = require('express'),
    router    = express.Router(),
    passport  = require('passport');

var user     = require('../controllers/userController'),
    book     = require('../controllers/bookController'),
    bug      = require('../controllers/bugController'),
    review      = require('../controllers/reviewController'),
    bookReview      = require('../controllers/bookReviewController');
 
    
// Verify that user is MEEEEE!!!
var authCheck = (req, res, next) => {
    console.log(req.user)
    if(req.user._id == req.params.id || req.user._id == '5d1e1208f7465cc875da09b9'){
        next()
    } else {
        res.redirect('/books')
    }
}

// Checks if I am logged in: If I am, route to home otherwise route to login
router.get('/', (req, res) => {
    console.log(req.user)
    if(req.user._id == req.params.id || req.user._id == '5d1e1208f7465cc875da09b9'){
      console.log("User Logged in!")
      res.redirect('/books')
    } else {
        res.redirect('auth/google')
    }
})


// Log out
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

// auth with google+
router.get('auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('auth/google/redirect', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.user.url);
});

//Startup Routes
router.get('/app', book.index)

router.get('/book/create', book.create_get)
// router.post('/book/create', book.create_post)
router.post('/book/create', book.create_post)

router.get('/book/:id/delete', book.delete_get)
router.post('/book/:id/delete', book.delete_post)

router.get('/book/:id/update', book.update_get)
router.post('/book/:id/update', book.update_post)


router.get('/book/:id/translate', book.translate_get)
router.post('/book/:id/translate', book.translate_post)

router.get('/book/:id', book.detail)
router.get('/books', book.list)

// Bug Routes

router.get('/bug/create', bug.create_get)
router.post('/bug/create', bug.create_post)

router.post('/bug/tag', bug.tag_post)

router.post('/bug/:id/delete', bug.delete_post)

router.get('/bug/:id/update', bug.update_get)
router.post('/bug/:id/update', bug.update_post)
router.post('/bug/:id/complete', bug.complete_post)

router.get('/bug/:id', bug.detail)
router.get('/bugs', bug.list)

// Review Routes

router.get('/review/create', review.create_get)
router.post('/review/create', review.create_post)

router.post('/review/tag', review.tag_post)

router.post('/review/:id/delete', review.delete_post)

router.get('/review/:id/update', review.update_get)
router.post('/review/:id/update', review.update_post)
router.post('/review/:id/complete', review.complete_post)

router.get('/review/:id', review.detail)
router.get('/reviews', review.list)

    //User Routes
router.get('/user/create', user.create_get)
router.post('/user/create', user.create_post)

router.get('/user/:id/delete', authCheck, user.delete_get)
router.post('/user/:id/delete', authCheck, user.delete_post)

router.get('/user/:id/update', authCheck, user.update_get)
router.post('/user/:id/update', authCheck, user.update_post)

router.get('/user/:id', authCheck, user.detail)
router.get('/users', authCheck, user.list)

// Book Review Routes

router.get('/bookReview/create', bookReview.create_get)
router.post('/bookReview/create', bookReview.create_post)

router.post('/bookReview/:id/delete', bookReview.delete_post)

router.get('/bookReview/:id/update', bookReview.update_get)
router.post('/bookReview/:id/update', bookReview.update_post)
router.post('/bookReview/:id/complete', bookReview.complete_post)

router.get('/bookReview/:id', bookReview.detail)
router.get('/bookReviews', bookReview.list)

module.exports = router;
