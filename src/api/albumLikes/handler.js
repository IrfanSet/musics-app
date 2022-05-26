const ClientError = require("../../exceptions/ClientError");

class albumLikesHandler{
    constructor(service){
        this._services = service;

        this.postLikesHandler = this.postLikesHandler.bind(this);
        this.getLikesHandler = this.getLikesHandler.bind(this);
    }

    async postLikesHandler(request, h){
       try {
        const user = request.auth.credentials.id;
        const {id} = request.params;

        const result = await this._services.postLikes(id,user);

        const response = h.response({
            status: 'success',
            message: `${result} berhasil`
        })
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
    async getLikesHandler(request, h){
        const {id} = request.params;
        
        const {likes, isCache = 0} = await this._services.getLikes(id)
        
        const response = h.response({
            status: 'success',
            data: {
                likes: likes.length
            }
        });

        response.code(200);
        if (isCache) {
            response.header('X-Data-Source', 'cache');
        }
        return response;
    }
}
module.exports = albumLikesHandler;