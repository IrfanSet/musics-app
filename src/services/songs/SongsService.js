const {
    Pool
} = require('pg');
const {
    nanoid
} = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._pool = new Pool;
    }

    async addSong({
        title,
        year,
        performer,
        genre,
        duration,
        albumId
    }) {
        let text, values;
        const id = `song-${nanoid(16)}`;

        if (duration && albumId) {
            text = 'insert into songs values($1, $2, $3, $4, $5, $6, $7) returning id';
            values = [id, title, year, performer, genre, duration, albumId];
        } else if (!duration && !albumId) {
            text = 'insert into songs values($1, $2, $3, $4, $5) returning id';
            values = [id, title, year, performer, genre];
        } else if (!albumId) {
            text = 'insert into songs values($1, $2, $3, $4, $5, $6) returning id';
            values = [id, title, year, performer, genre, duration];
        } else {
            text = 'insert into songs(id, title, year, performer, genre, "albumId") values($1, $2, $3, $4, $5, $6) returning id';
            values = [id, title, year, performer, genre, albumId];
        }
        const query = {
            text: text,
            values: values
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Song gagal ditambahkan');
        }

        return result.rows[0].id
    }

    async getSongs(queryPrm = null) {
        if (Object.keys(queryPrm).length > 0) {
            if (queryPrm.title && queryPrm.performer) {
                const query = {
                    text: "select id, title, performer from songs where title ilike $1 and performer ilike $2",
                    values: [`%${queryPrm.title}%`, `%${queryPrm.performer}%`]
                }
                const result = await this._pool.query(query);

                return result.rows;
            } else {
                const query = {
                    text: "select id, title, performer from songs where title ilike $1 or performer ilike $2",
                    values: [`%${queryPrm.title}%`, `%${queryPrm.performer}%`]
                }
                const result = await this._pool.query(query);

                return result.rows;
            }

        }
        const result = await this._pool.query('select id, title, performer from songs');
        return result.rows;
    }

    async getSongById(songId) {
        const query = {
            text: 'select * from songs where id = $1',
            values: [songId]
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Song tidak ditemukan.')
        }

        return result.rows[0];
    }

    async editSongById(songId, {
        title,
        year,
        performer,
        genre,
        duration,
        albumId
    }) {
        let text, values;

        if (duration && albumId) {
            text = 'update songs set title=$1, year = $2, performer = $3, genre = $4, duration = $5, "albumId" = $6 where id = $7 returning id';
            values = [title, year, performer, genre, duration, albumId, songId];
        } else if (!duration && !albumId) {
            text = 'update songs set title=$1, year = $2, performer = $3, genre = $4 where id = $5 returning id';
            values = [title, year, performer, genre, songId];
        } else if (!albumId) {
            text = 'update songs set title=$1, year = $2, performer = $3, genre = $4, duration = $5 where id = $6 returning id';
            values = [title, year, performer, genre, duration, songId];
        } else {
            text = 'update songs set title=$1, year = $2, performer = $3, genre = $4, "albumId" = $5 where id = $6 returning id';
            values = [title, year, performer, genre, albumId, songId];
        }

        const query = {
            text: text,
            values: values
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Song gagal diubah. Id tidak ditemukan');
        }
    }

    async deleteSongById(songId) {
        const query = {
            text: 'delete from songs where id = $1 returning id',
            values: [songId]
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
        }
    }

    async verifySongId(songId){
        const query = {
            text: 'Select * from songs where id = $1',
            values: [songId]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Id tidak ditemukan');
        }
    }

}

module.exports = SongsService;