const db = require('./conn.js');

class Books {
    constructor(id) {
        this.id = id;
    }

    static async addReview(review, book_id, user_id) {
        const query = `
        INSERT INTO reviews 
            (content, book_id, user_id) 
        VALUES ('${review}', ${book_id}, ${user_id})`;

        try {
            let response = await db.result(query)
            return response;
        } catch(err) {
            console.log("ERROR", err.message);
            return err;
        };
    }

    static async getUser(email) {
        try {
            const response = await db.one(`
            select id 
            from users 
            where email='${email}'`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getAllReviewsForBook(book_id) {
        try {
            const response = await db.any(`
            select book_id, title, author, content
            from books, reviews
            where books.id='${book_id}' and book_id=books.id`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getBookInfo(id) {
        try {
            const response = await db.any(`
            select author, title 
            from books 
            where books.id='${id}'`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getOneReviewForBook(name, book_id) {
        try {
            const response = await db.any(`
            select book_id, author, title 
            from books, reviews 
            where books.title='${name}' and book_id=books.id and book_id=${book_id}`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getAllBooks() {
        try {
            const response = await db.any(`
            select distinct books.id, author, pages, title, year, book_id
            from books, reviews 
            where book_id=books.id`);
            return response;
        } catch(err) {
            return err.message
        }
    }

}

module.exports = Books;