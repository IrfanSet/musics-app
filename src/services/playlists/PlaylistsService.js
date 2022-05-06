const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationsError = require('../../exceptions/AuthorizationError');

class PlaylistsService{
    constructor(){
        this._pool = new Pool;
    }

    async addPlaylist({name, owner}){
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'insert into playlists values($1, $2, $3) returning id',
            values: [id, name, owner]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylist(owner){
        const query = {
            text: 'select pl.id, pl.name, usr.username from playlists as pl left join users as usr on pl.owner = usr.id where owner = $1',
            values: [owner]
        }

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deletePlaylist(id){
        // delete playlist_songs
        const query = {
            text: 'delete from playlist_songs where playlist_id = $1',
            values: [id]
        };
        await this._pool.query(query);
        // end of delete playlist_songs
        const query2 = {
            text: 'delete from playlists where id = $1 returning id',
            values: [id]
        }

        const result = await this._pool.query(query2);

        if (!result.rows.length) {
            throw new NotFoundError('Hapus gagal, id tidak ditemukan');
        }
    }

    async verifyOwnerPlaylist(playlistId, owner){
        const query = {
            text: 'select * from playlists where id = $1 and owner = $2',
            values: [playlistId, owner]
        }

        const result = await this._pool.query(query);
    
        if (result.rows.length <= 0) {
            throw new AuthorizationsError('Anda tidak berhak memiliki resource ini');
        }
    }
}

module.exports = PlaylistsService;