const bcrypt = require('bcryptjs'),
    Users = require('../models/users');

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