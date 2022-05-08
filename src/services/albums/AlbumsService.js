const {
    Pool
} = require('pg');
const {
    nanoid
} = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
    constructor() {
        this._pool = new Pool;
    };

    async addAlbum({
        name,
        year
    }) {

        const id = `album-${nanoid(16)}`;
        const query = {
            text: 'insert into albums values($1, $2, $3) returning id',
            values: [id, name, year]
        }
        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('select * from albums');
        return result.rows;
    }

    async getAlbumById(albumId) {
        const query = {
            text: 'select id, name, year, cover as "coverUrl" from albums where id = $1',
            values: [albumId]
        }

        const query2 = {
            text: 'select id, title, performer from songs where "albumId" = $1',
            values: [albumId]
        }

        const result = await this._pool.query(query);
        const result2 = await this._pool.query(query2);

        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan.')
        }
        return [result.rows[0], result2.rows];
    }

    async editAlbumById(albumId, {
        name,
        year
    }) {
        const query = {
            text: 'update albums set name = $1, year = $2 where id = $3 returning id',
            values: [name, year, albumId]
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Album gagal diubah. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(albumId) {
        const query = {
            text: 'delete from albums where id = $1 returning id',
            values: [albumId]
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }

    async saveUrl(id, url){
        const query = {
            text: 'update albums set cover = $1 where id = $2 returning id',
            values: [url, id]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('id tidak ditemukan');
        }

    }
}

module.exports = AlbumsService;