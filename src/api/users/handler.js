const ClientError = require("../../exceptions/ClientError");

class UsersHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.postUserhandler =  this.postUserhandler.bind(this);
    }

    async postUserhandler(request, h){
        try {
            this._validator.validateUserPayload(request.payload);
    
            const {username, password, fullname} = request.payload;

            const userId = await this._service.addUSers({username, password, fullname});

            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    userId: userId
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
}

module.exports = UsersHandler;