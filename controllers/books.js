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