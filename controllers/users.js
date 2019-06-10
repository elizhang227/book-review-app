const bcrypt = require('bcryptjs'),
    User = require('../models/users');

exports.homepage_get = async (req, res) => {
    const allUsers = await Users.getAllUsers();

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
}

exports.signup_get = (req, res) => {
    res.render('template', {
        locals: {
            title: 'Signup Page',
            is_logged_in: req.session.is_logged_in,
        },
        partials: {
            content: 'partial-signup-form'
        }
    });
}

exports.login_get = (req, res) => {
    res.render('template', {
        locals: {
            title: 'Login Page',
            is_logged_in: req.session.is_logged_in,
        },
        partials: {
            content: 'partial-login-form'
        }
    });
}

exports.logout_get = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

exports.signup_post = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Salt and hash our password!
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Creates a new user instance, with the sign up information
    const userInstance = new User(null, first_name, last_name, email, hash);
    let check = await userInstance.emailExists();
    if (typeof check === 'object') {
        res.redirect('/users/login');
    } else {
        await userInstance.createUser().then(response => {
            console.log("response is", response);
            res.redirect('/');
        }) .catch(err => err);
    }
}

exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    const userInstance = new User(null, null, null, email, password);

    const userData = await userInstance.getUserByEmail();

    const isValid = bcrypt.compareSync(password, userData.password);

    if (!!isValid) {
        req.session.is_logged_in = true;
        req.session.email = userData.email;
        req.session.first_name = userData.first_name;
        req.session.last_name = userData.last_name;
        req.session.user_id = userData.user_id;
        res.redirect('/books');
    } else {
        res.redirect('/');
    }
}