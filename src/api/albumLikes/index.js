const albumLikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'albumLikes',
    version: '1.0.0',
    register: async (server, {service}) => {
        const AlbumLikesHandler = new albumLikesHandler(service);
        server.route(routes(AlbumLikesHandler));
    }
}