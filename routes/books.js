const express = require('express'),
    router = express.Router(),
    booksModel = require('../models/books');

router.get('/', async function(req, res, next) {
    const allBooks = await booksModel.getAllBooks();

    if(!!req.session.is_logged_in) {
        res.render('template', {
            locals: {
                title: `Welcome to my dungeon ${req.session.first_name}`,
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

router.get('/:books/:review', (req, res, next) => {
    console.log(req.params);
    const booksId = req.params.books;
    const review = req.params.review;

    booksModel.getOneBook(booksId)
    .then(async () => {
        const allReviews = await booksModel.getOneReviewForBook(booksId, review);

        res.status(200).render('template', {
            locals: {
                title: 'List of REVIEWS',
                reviewList: allReviews
            },
            partials: {
                content: 'partial-review'
            }
        });
    })
    .catch((err) => {
        res.sendStatus(500).send(err.message);
    });
});

module.exports = router;