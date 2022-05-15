const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");

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

        if (!result.rows.length) {
            const query = {
                text: 'delete from user_album_likes where album_id = $1 and user_id = $2',
                values: [id, user]
            }
            await this._pool.query(query);
        } else {
            const id_ = `like-${nanoid(16)}`
            const newQuery = {
                text: 'insert into user_album_likes values($1, $2, $3)',
                values: [id_, user, id]
            }
            await this._pool.query(newQuery);
        }
    }

    async getLikes(id){
        try {
            const result = await this._cacheService.get(`likes:${id}`);
            return { likes: JSON.parse(result), isCache: 1 };
        } catch (error) {
            const query = {
                text: 'select count(id) as likes from user_album_likes where album_id=$1',
                values: [id]
            }
    
            const result = await this._pool.query(query);
    
            await this._cacheService.set(`likes:${id}`, JSON.stringify(result.rows[0].likes));
    
            return result.rows[0].likes;
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