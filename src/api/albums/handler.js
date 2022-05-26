const ClientError = require("../../exceptions/ClientError");

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.editAlbumByIdHandler = this.editAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload)
            const {
                name,
                year
            } = request.payload;

            const albumId = await this._service.addAlbum({
                name,
                year
            });

            const response = h.response({
                status: 'success',
                data: {
                    albumId
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

    async getAlbumsHandler(request, h) {
        const albums = await this._service.getAlbums();

        return h.response({
            status: 'success',
            data: {
                albums: albums,
            },
        }).code(200);
    }

    async getAlbumByIdHandler(request, h) {
        try {

            const {
                albumId
            } = request.params;

            const result = await this._service.getAlbumById(albumId);
            const albumById = result[0];

            albumById['songs'] = result[1];

            return h.response({
                status: 'success',
                data: {
                    album: albumById
                }
            }).code(200);
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

    async editAlbumByIdHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const {
                albumId
            } = request.params;

            const {
                name,
                year
            } = request.payload;

            await this._service.editAlbumById(albumId, {
                name,
                year
            });

            const response = h.response({
                status: 'success',
                message: 'Album berhasil diedit'
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

    async deleteAlbumByIdHandler(request, h) {
        try {

            const {
                albumId
            } = request.params;

            await this._service.deleteAlbumById(albumId);

            const response = h.response({
                status: 'success',
                message: 'Album berhasil dihapus'
            });
            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode)
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

module.exports = AlbumsHandler;