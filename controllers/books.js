const booksModel = require('../models/books');

exports.homepage_get = async (req, res) => {
    const allBooks = await booksModel.getAllBooks();

    //if(!!req.session.is_logged_in) {
    res.render('template', {
        locals: {
            title: `Welcome to my dungeon ${req.session.first_name}`,
            booksList: allBooks,
            is_logged_in: req.session.is_logged_in,
            userName: req.session.first_name,
            email: req.session.email
        },
        partials: {
            content: 'partial-books'
        }
    });
}
    //else {
    //res.redirect('/');
    //}
//});

exports.book_id_get = async (req, res) => {
    const bookID  = req.params.book_id;
    const allReviews = await booksModel.getAllReviewsForBook(bookID);
    const bookInfo = await booksModel.getBookInfo(bookID);

    res.render('template', { 
        locals: {
            title: 'YOU GET A REVIEW, YOU GET A REVIEW, EVERYONE GETS A REVIEW',
            is_logged_in: req.session.is_logged_in,
            reviewsList: allReviews,
            userName: req.session.first_name,
            email: req.session.email,
            bookInfo: bookInfo
        },
        partials : {
            content: 'partial-reviews'
        }
    });
}

exports.book_id_post = async (req, res) => {
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
}