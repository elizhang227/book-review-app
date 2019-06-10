const express = require('express'),
    bcrypt = require('bcryptjs'),
    router = express.Router(),
    usersModel = require('../models/users');

const UsersControllers = require('../controllers/users');

router.get('/', UsersControllers.homepage_get);

router.get('/login', UsersControllers.login_get);

router.get('/signup', UsersControllers.signup_get);

router.get('/logout', UsersControllers.logout_get);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userInstance = new usersModel(null, null, null, email, password);

  await userInstance.login().then(response => {
    req.session.is_logged_in = response.isValid;
    if (!!response.isValid) {
      req.session.email = response.email;
      req.session.first_name = response.first_name;
      req.session.last_name = response.last_name;
      req.session.user_id = response.user_id;
      res.redirect('/books');
    } else {
      res.redirect('/');
    }
  })
});

router.post('/signup', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Salt and hash our password!
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // Creates a new user instance, with the sign up information
  const userInstance = new usersModel(null, first_name, last_name, email, hash);
  let check = await userInstance.emailExists();
  if (typeof check === 'object') {
    res.redirect('/users/login');
  } else {
      await userInstance.createUser().then(response => {
        console.log("response is", response);
        res.redirect('/');
      }) .catch(err => err);
  }
});

module.exports = router;