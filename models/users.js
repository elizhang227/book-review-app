const db = require('./conn.js'),
    bcrypt = require('bcryptjs');

class Users {
    constructor(id, first_name, last_name, email, password) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }

    async checkPassword(hashedPassword) {
        // first argument is what the user put in the form
        // second argument is the hashed password
        return bcrypt.compareSync(this.password, hashedPassword);
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

    async login() {
        try {
            const response = await db.one(`
                select id, first_name, last_name, password
                    from users
                where email = $1`, [this.email]);
            console.log(response);
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