const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require('../../exceptions/InvariantError');
class AlbumLikesService{
    constructor(cacheService){
        this._pool = new Pool;
        this._cacheService = cacheService;
    }

    async postLikes(id, user){
        await this.validateAlbums(id);
        const query = {
            text: 'select * from user_album_likes where album_id = $1 and user_id = $2',
            values: [id, user]
        }

        const result = await this._pool.query(query);
        console.log(result.rows);
        // return false

        if (result.rows.length != 0) {
            const query = {
                text: 'delete from user_album_likes where album_id = $1 and user_id = $2',
                values: [id, user]
            }
            await this._pool.query(query);
            await this._cacheService.delete(`likes:${id}`);
            return 'hapus'
        } else {
            const id_ = `like-${nanoid(16)}`
            const newQuery = {
                text: 'insert into user_album_likes values($1, $2, $3) returning id',
                values: [id_, user, id]
            }
            const newRun = await this._pool.query(newQuery);
            if (!newRun.rows[0].id) {
                throw new InvariantError('Likes gagal ditambahkan');
            }
            await this._cacheService.delete(`likes:${id}`);
            return 'insert'
        }
    }

    async getLikes(id){
        try {
            const result = await this._cacheService.get(`likes:${id}`);
            return { likes: JSON.parse(result), isCache: 1 };
        } catch (error) {
            const query = {
                text: 'select * from user_album_likes where album_id = $1',
                values: [id]
            }
    
            const result = await this._pool.query(query);
            await this._cacheService.set(`likes:${id}`, JSON.stringify(result.rows));
    
            return {likes: result.rows};
        }
    }

    async validateAlbums(id){
        const query = {
            text: 'select * from albums where id = $1',
            values: [id]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('album id tidak valid')
        }
    }
}
module.exports = AlbumLikesService;