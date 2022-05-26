const {
    nanoid
} = require('nanoid');
const {
    Pool
} = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
    constructor() {
        this._pool = new Pool;
    }

    async addUsers({
        username,
        password,
        fullname
    }) {
        // validasi usernaem
        await this.verifyNewUsername(username);
        // end of validasi
        const id = `user-${nanoid(16)}`;

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = {
            text: 'insert into users values($1, $2, $3, $4) returning id',
            values: [id, username, hashedPassword, fullname]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return result.rows[0].id
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'select * from users where username = $1',
            values: [username]
        }

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
        }
    }

    async verifyUserCredential(username, password) {
        const query = {
            text: 'select id, password from users where username = $1',
            values: [username]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        const {
            id,
            password: hashedPassword
        } = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah')
        }

        return id;
    }
}

module.exports = UsersService;