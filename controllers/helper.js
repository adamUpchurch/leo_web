const axios = require('axios')
var Book = require('../models/book');


var bookRequests = function(url, data, obj) => {
    axios.post(url, data)
        .then(resp => {
        // if no error with splitting, add to book object
        // save story
        if (obj instanceof Book) {}
        book.story.en = resp.data
        book.save(err => {
            if(err) {res.render('book_form',  { title: 'Create Book', book: book, errors: errors.array()})}
            res.redirect(book.url)
        })
    }).catch(error => {
        // error with splitting - currently not return error to user
        console.log('=================== Error=======================')
        console.log(error.response.status)
        console.log(error.response.statusText)
        console.log('=================== Error=======================')

        res.render('book_form',  { title: 'Create Book', book: obj})
    });
}