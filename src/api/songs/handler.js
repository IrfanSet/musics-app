const ClientError = require("../../exceptions/ClientError");

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.editSongByIdHandler = this.editSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const {
                title,
                year,
                performer,
                genre,
                duration,
                albumId
            } = request.payload;

            const songId = await this._service.addSong({
                title,
                year,
                performer,
                genre,
                duration,
                albumId
            });

            const response = h.response({
                status: 'success',
                data: {
                    songId: songId
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
                response.code(error.statusCode);
                return response;
            }

            // error server
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500);
            console.log(error);
            return response;
        }
    }

    async getSongsHandler(request, h) {
        const queryPrm = request.query;
        const songs = await this._service.getSongs(queryPrm);
        return h.response({
            status: 'success',
            data: {
                songs: songs
            }
        }).code(200);
    }

    async getSongByIdHandler(request, h) {
        try {
            const {
                songId
            } = request.params;

            const song = await this._service.getSongById(songId);

            const response = h.response({
                status: 'success',
                data: {
                    song: song
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

            // error server
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500);
            console.log(error);
            return response;
        }
    }

    async editSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const {
                songId
            } = request.params;
            const {
                title,
                year,
                performer,
                genre,
                duration,
                albumId
            } = request.payload;

            await this._service.editSongById(songId, {
                title,
                year,
                performer,
                genre,
                duration,
                albumId
            });

            const response = h.response({
                status: 'success',
                message: 'Song berhasil diedit'
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

            // error server
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500);
            console.log(error);
            return response;
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const {
                songId
            } = request.params;

            await this._service.deleteSongById(songId);

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
            // error server
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500);
            console.log(error);
            return response;
        }
    }
}

module.exports = SongsHandler;