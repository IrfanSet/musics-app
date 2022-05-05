const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlist',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'musicsapp_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlist',
        handler: handler.getPlaylistHandler,
        options: {
            auth: 'musicsapp_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/playlist/{id}',
        handler: handler.deletePlaylistHandler,
        options: {
            auth: 'musicsapp_jwt'
        },
    },
]

module.exports = routes;