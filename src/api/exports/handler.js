const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
    constructor(service, validator, playlistService) {
        this._service = service;
        this._validator = validator;
        this._playlistService = playlistService;

        this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
    }

    async postExportNotesHandler(request, h) {
        try {
            await this._validator.validateExportNotesPayload(request.payload);
            const {playlistId} = request.params;
            const {userId} = request.auth.credentials.id;
            await this._playlistService.verifyOwnerPlaylist(playlistId, userId);
            
            const message = {
                playlistId: playlistId,
                userId: userId,
                targetEmail: request.payload.targetEmail,
            };

            await this._service.sendMessage('export:musics', JSON.stringify(message));

            const response = h.response({
                status: 'success',
                message: 'Permintaan Anda sedang kami proses',
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

module.exports = ExportsHandler;