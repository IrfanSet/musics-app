const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler{
    constructor(playlistSongService, songsService, PlaylistsService, validator){
        this._playlistSongService = playlistSongService;
        this._songsService = songsService;
        this._playlistServices = PlaylistsService;
        this._validator = validator;

        this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
        this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
        this.deletePlaylistSongsHandler = this.deletePlaylistSongsHandler.bind(this);
    }

    async postPlaylistSongsHandler(request, h) {
        try {
            // validasi paylod
            await this._validator.validatePlaylistSongPayload(request.payload);
    
            const {songId} = request.payload;
            // validasi songId
            await this._songsService.verifySongId(songId);

            const {id:owner} = request.auth.credentials;
            const {id} = request.params;
            // validasi owner
            await this._playlistServices.verifyOwnerPlaylist(id, owner);
            // end of validasi

    
            await this._playlistSongService.addPlaylistSongs(id, songId);
            const response = h.response({
                status: 'success',
                message: 'lagu berhasil ditambahkan'
            });

            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }            

            // server Error
            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami'
            });
            response.code(500);
            console.log(error);
            return response;
        }

        
    }

    async getPlaylistSongsHandler(request, h) {
        try {
            const {id} = request.params;
            const {id:owner} = request.auth.credentials;
            await this._playlistServices.verifyOwnerPlaylist(id, owner);

            const result = await this._playlistSongService.getPlaylistSongs(id, owner);
            const playlists = result[0];
            if (playlists != undefined) {
                playlists['songs'] = result[1];
            }

            const response = h.response({
                status: 'success',
                data: {
                    playlist: playlists
                }
            });
            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }            

            // server Error
            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami'
            });
            response.code(500);
            console.log(error);
            return response;
        }
    }

    async deletePlaylistSongsHandler(request, h){
        try {
            const {id} = request.params;
            const {songId} = request.payload;
            const {id:owner} = request.auth.credentials;
    
            // validasi songId
            await this._songsService.verifySongIdDelete(songId);
            // validasi owner
            await this._playlistServices.verifyOwnerPlaylist(id, owner);
            // end of validasi
            
            await this._playlistSongService.deletePlaylistSongs(id, songId);
            const response = h.response({
                status: 'success',
                message: 'Song berhasil dihapus'
            });
    
            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }            

            // server Error
            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami'
            });
            response.code(500);
            console.log(error);
            return response;
        }
    }
}
module.exports = PlaylistSongsHandler;