const express = require('express'),
    router = express.Router(),
    booksController = require('../controllers/books'),
    booksModel = require('../models/books');

router.get('/', booksController.homepage_get);

router.get('/:book_id', booksController.book_id_get);

router.post('/:book_id', async function(req, res, next) {
    console.log("this is the req body", req.body);
    const { review } = req.body;
    console.log("this is the req params", req.params);
    const bookID = req.params.book_id;
    const bookInfo = await booksModel.getBookInfo(bookID);
    const userID = await booksModel.getUser(req.session.email);

    if(!!req.session.is_logged_in) {
        booksModel.addReview(review, bookID, userID.id)
        .then(async () => {
            res.redirect(`/books/${bookID}`); // post-get-redirect to avoid form resubmission
            const allReviews = await booksModel.getAllReviewsForBook(bookID);

            res.status(200).render('template', {
                locals: {
                    title: 'List of Reviews for the book: ',
                    is_logged_in: req.session.is_logged_in,
                    reviewsList: allReviews,
                    userName: req.session.first_name,
                    bookInfo: bookInfo,
                    email: req.session.email
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