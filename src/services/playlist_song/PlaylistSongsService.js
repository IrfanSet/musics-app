const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistSongsService{
    constructor(){
        this._pool = new Pool;
    }

    async addPlaylistSongs(playlistId, songId){

        const id = `playlistSongs-${nanoid(16)}`;
        const query = {
            text: 'insert into playlist_songs values($1, $2, $3) returning id',
            values: [id, playlistId, songId]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Song gagal ditambahkan ke dalam plalist');
        }

        return result.rows[0].id;
    }

    async getPlaylistSongs(playlistId, owner){
        const query = {
            text: 'select pl.id, pl.name, usr.username from playlists as pl left join users as usr on pl.owner = usr.id where pl.owner = $1 and pl.id = $2',
            values: [owner, playlistId]
        }

        const result = await this._pool.query(query);

        const query2 = {
            text: `select pls.song_id as id, sgs.title, sgs.performer from playlist_songs as pls 
                   left join songs as sgs on pls.song_id = sgs.id
                   left join playlists as pl on pl.id = pls.playlist_id
                   left join users as usr on usr.id = pl.owner
                   where pl.owner = $1 and pls.playlist_id = $2`,
            values: [owner, playlistId]
        }

        const result2 = await this._pool.query(query2);

        return [result.rows[0],result2.rows];
    }

    async deletePlaylistSongs(playlistId, songId){
        this.verifyDeletePlaylist(playlistId, songId);
        const query = {
            text: 'delete from playlist_songs where playlist_id = $1 and song_id = $2 returning playlist_id',
            values: [playlistId, songId]
        }

        await this._pool.query(query);
    }

    async verifyDeletePlaylist(playlistId, songId){
        const query = {
            text: 'select * from playlist_songs where playlist_id = $1 and song_id = $2',
            values: [playlistId, songId]
        }
        const result = await this._pool.query(query);
        
        if (!result.rows.length) {
            throw new NotFoundError('playist_id atau song_id tidak ditemukan');
        }
    }
}

module.exports = PlaylistSongsService;