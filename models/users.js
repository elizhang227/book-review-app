const db = require('./conn.js');

class Users {
    constructor(id, first_name, last_name, email, password) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }

    static async getAllUsers() {
        try {
            const response = await db.any(`select * from users`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    async createUser() {
        try {
            const response = await db.one(`
            insert into users 
                (first_name, last_name, email, password) 
            values 
                ($1, $2, $3, $4)
            returning id`, [this.first_name, this.last_name, this.email, this.password]); // references $1, $2, $3, $4 $ = interpolation 1,2,3,4 = placeholder
            return response;
        } catch(err) {
            return err.message
        }
    }

    async getUserByEmail() {
        try {
            const response = await db.one(`
            select id, first_name, last_name, password, email
                from users
            where email = $1`, [this.email]);
            return response;
        } catch(err) {
            return err.message;
        }
    }

    async emailExists() {
        try {
            const response = await db.one(`select email from users where email = $1`, [this.email]);
            return response;
        } catch(err) {
            return err.message
        }
    }

}

module.exports = Users;