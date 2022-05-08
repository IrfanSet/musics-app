const ClientError = require('../../exceptions/ClientError');
class UploadsHandler {
    constructor(service, validator, albumService) {
        this._service = service;
        this._validator = validator;
        this._albumService = albumService;

        this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(request, h) {
        try {
            const {
                cover: data
            } = request.payload;
            const {id} = request.params;
            this._validator.validateImageHeaders(data.hapi.headers);

            const filename = await this._service.writeFile(data, data.hapi);
            const fileLoc = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

            await this._albumService.saveUrl(id, fileLoc);
            const response = h.response({
                status: 'success',
                message: 'Sampul berhasil diunggah'
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = UploadsHandler;