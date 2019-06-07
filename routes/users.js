const express = require('express'),
    bcrypt = require('bcryptjs'),
    router = express.Router(),
    usersModel = require('../models/users');

router.get('/', async (req, res, next) => {
    const allUsers = await usersModel.getAllUsers();

    res.render('template', { 
        locals: {
            title: 'List of Users',
            usersList: allUsers,
            is_logged_in: req.session.is_logged_in,
        },
        partials : {
            content: 'partial-users'
        }
    });
})

router.get('/login', async (req, res, next) => {
  res.render('template', {
    locals: {
      title: 'Login Page',
      is_logged_in: req.session.is_logged_in,
    },
    partials: {
      content: 'partial-login-form'
    }
  })
});

router.get('/signup', async (req, res, next) => {
  res.render('template', {
    locals: {
      title: 'Signup Page',
      is_logged_in: req.session.is_logged_in,
    },
    partials: {
      content: 'partial-signup-form'
    }
  })
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userInstance = new usersModel(null, null, null, email, password);

  await userInstance.login().then(response => {
    req.session.is_logged_in = response.isValid;
    if (!!response.isValid) {
      req.session.first_name = response.first_name;
      req.session.last_name = response.last_name;
      req.session.user_id = response.user_id;
      res.redirect('/books');
    } else {
      res.sendStatus(401);
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