const PlaylistSongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'PlaylistSongs',
    version: '1.0.0',
    register: async (server, {playlistSongService, songsService, PlaylistsService, validator}) => {
        const playlistSongsHandler = new PlaylistSongsHandler(playlistSongService, songsService, PlaylistsService, validator);
        server.route(routes(playlistSongsHandler));
    }
}