class PlaylistHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request, h){
        try {
            this.validator.validatePlaylistPayload(request.payload);
    
            const {name} = request.payload;
            const {id:owner} = request.auth.credentials;
    
            const playlistId = await this._service.addPlaylist({name, owner});
            
            const response = h.response({
                status: 'success',
                data: {
                    playlistId: playlistId
                }
            });

            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.code);
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

    async getPlaylistHandler(request, h){
        const {id:owner} = request.auth.credentials;

        const playlists = await this._service.getPlaylist(owner);

        const response = h.response({
            status: 'success',
            data: {
                playlists: playlists
            }
        });
        response.code(200);
        return response;
    }

    async deletePlaylistHandler(request, h){
        try {
            const id = request.params
            await this._service.deletePlaylist(id);

            const response = h.response({
                status: 'fail',
                message: 'Playlist berhasil di hapus'
            });

            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.code);
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

module.exports = PlaylistHandler;