create database bookapp;

create table books
(
    id serial primary key,
    author varchar(200),
    pages integer,
    title varchar(200),
    year integer
);

create table users
(
    id serial primary key,
    first_name varchar(100),
    last_name varchar(100),
    email varchar(200),
    password varchar(500)
);

create table reviews
(
    id serial primary key,
    score integer,
    content text,
    book_id integer references books(id),
    user_id integer references users(id)
);