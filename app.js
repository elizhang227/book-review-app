const express = require('express'),
    session = require('express-session'),
    es6Renderer = require('express-es6-template-engine'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan');

const indexRouter = require('./routes/index'),
    usersRouter = require('./routes/users'),
    booksRouter = require('./routes/books');

var app = express();

app.engine('html', es6Renderer);
app.set('views', './views');
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'get rad',
    resave: false,
    saveUninitialized: true,
    is_logged_in: false
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

module.exports = app;

