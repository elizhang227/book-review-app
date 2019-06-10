const express = require('express'),
    router = express.Router(),
    booksController = require('../controllers/books');

router.get('/', booksController.homepage_get);
router.get('/:book_id', booksController.book_id_get);
router.post('/:book_id', booksController.book_id_post);

module.exports = router;