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

router.get('/:book_id', async function(req, res, next) {
    const bookID  = req.params.book_id;
    const allReviews = await booksModel.getAllReviewsForBook(bookID);
    const bookInfo = await booksModel.getOneBook(bookID);

    res.render('template', { 
        locals: {
            title: 'YOU GET A REVIEW, YOU GET A REVIEW, EVERYONE GETS A REVIEW',
            is_logged_in: req.session.is_logged_in,
            reviewsList: allReviews,
            bookInfo: bookInfo
        },
        partials : {
            content: 'partial-reviews'
        }
    });
});

router.post('/:book_id', async function(req, res, next) {
    console.log("this is the req body", req.body);
    const { name } = req.body;
    console.log("this is the req params", req.params);
    const bookID = req.params.book_id;
    const bookInfo = await booksModel.getOneBook(bookID);

    if(!!req.session.is_logged_in) {
        booksModel.addReview(name, bookID)
        .then(async () => {
            const allTopics = await booksModel.getAllReviewsForBook(bookID);

            res.status(200).render('template', {
                locals: {
                    title: 'List of Topics from Class',
                    is_logged_in: req.session.is_logged_in,
                    reviewsList: allTopics,
                    bookInfo: bookInfo
                },
                partials: {
                    content: 'partial-reviews'
                }
            });
        })
        .catch((err) => {
            res.sendStatus(500).send(err.message);
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;