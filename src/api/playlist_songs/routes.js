const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistSongsHandler,
        options: {
            auth: 'musicsapp_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getPlaylistSongsHandler,
        options: {
            auth: 'musicsapp_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deletePlaylistSongsHandler,
        options: {
            auth: 'musicsapp_jwt'
        },
    }
]

module.exports = routes;