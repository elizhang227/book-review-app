const express = require('express'),
    router = express.Router(),
    booksModel = require('../models/books');

router.get('/', async function(req, res, next) {
    const allBooks = await booksModel.getAllBooks();

    if(!!req.session.is_logged_in) {
        res.render('template', {
            locals: {
                title: 'Home page',
                booksList: allBooks,
                is_logged_in: req.session.is_logged_in,
                userName: req.session.first_name
            },
            partials: {
                content: 'partial-books'
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;