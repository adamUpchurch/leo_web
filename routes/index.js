var express   = require('express'),
    router    = express.Router(),
    passport  = require('passport');

var user     = require('../controllers/userController'),
    book     = require('../controllers/bookController');
 
    
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
      res.redirect('/app')
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

    //User Routes
router.get('/user/create', user.create_get)
router.post('/user/create', user.create_post)

router.get('/user/:id/delete', authCheck, user.delete_get)
router.post('/user/:id/delete', authCheck, user.delete_post)

router.get('/user/:id/update', authCheck, user.update_get)
router.post('/user/:id/update', authCheck, user.update_post)

router.get('/user/:id', authCheck, user.detail)
router.get('/users', authCheck, user.list)

module.exports = router;

module.exports = router;
