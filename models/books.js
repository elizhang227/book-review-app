const db = require('./conn.js'),
    bcrypt = require('bcryptjs');

class Books {
    constructor(id, first_name, last_name, email, password) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }

    static async getAllReviewsForBook(name) {
        try {
            const response = await db.any(`
            select book_id, title, author, content 
            from books, reviews 
            where books.title='${name}' and book_id=books.id`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getOneBook(name) {
        try {
            const response = await db.any(`select author, title from books where books.title='${name}'`);
            console.log(response);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getOneReviewForBook(name, book_id) {
        try {
            const response = await db.any(`select book_id, author, title from books, reviews where books.title='${name}' and book_id=books.id and book_id=${book_id}`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getAllBooks() {
        try {
            const response = await db.any(`select * from books`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    async checkPassword(hashedPassword) {
        return bcrypt.compareSync(this.password, hashedPassword);
    }

    async createUser() {
        try {
            const response = await db.one(`
            insert into users
                (first_name, last_name, email, password)
            values
                ($1, $2, $3, $4)
            returning id`, [this.first_name, this.last_name. this.email, this.password]);
            return response;
        } catch(err) {
            return err.message
        }
    }

    async login() {
        try {
            const response = await db.one(`
                select id, first_name, last_name, password
                    from users
                where email = $1`, [this.email]);
            const isValid = await this.checkPassword(response.password);
            if (!!isValid) {
                const { first_name, last_name, id } = response;
                return { isValid, first_name, last_name, user_id: id }
            } else {
                return { isValid } 
            };
        } catch(err) {
            return err.message
        }
    }

}

module.exports = Books;