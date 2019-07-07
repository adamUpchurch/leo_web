var express     = require('express'),   
    router      = express.Router();

var user     = require('../controllers/userController'),
    book     = require('../controllers/bookController');
    
var authCheck = (req, res, next) => {
    console.log(req.user)
    if(req.user._id == req.params.id || req.user._id == '5d1e1208f7465cc875da09b9'){
        next()
    } else {
        res.redirect('/')
    }
}
    //Startup Routes
router.get('/', book.index)

router.get('/book/create', book.create_get)
router.post('/book/create', book.create_post)

router.get('/book/:id/delete', authCheck, book.delete_get)
router.post('/book/:id/delete', authCheck, book.delete_post)

router.get('/book/:id/update', authCheck, book.update_get)
router.post('/book/:id/update', authCheck, book.update_post)

router.get('/book/:id/translate', authCheck, book.translate_get)
router.post('/book/:id/translate', authCheck, book.translate_post)

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