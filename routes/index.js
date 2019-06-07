const express = require('express'),
  router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('template', {
    locals: {
      title: 'Home page',
      is_logged_in: req.session.is_logged_in,
      userName: req.session.first_name
    },
    partials: {
      content: 'partial-index'
    }
  });
});

module.exports = router;