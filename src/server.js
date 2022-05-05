require('dotenv').config();
const hapi = require('@hapi/hapi');
const AlbumsService = require('./services/albums/AlbumsService');
const albums = require('./api/albums');
const SongsService = require('./services/songs/SongsService');
const songs = require('./api/songs');
const AlbumValidator = require('./validator/AlbumValidator');
const songsValidator = require('./validator/SongValidator');
const Jwt = require('@hapi/jwt');

// users
const users = require('./api/users');
const usersService = require('./services/users/UsersService');
const usersValidator = require('./validator/UsersValidator');

// authentocations
const authentications = require('./api/authentications')
const authenticationsService = require('./services/authentications/AuthenticationsService');
const authenticationsValidator = require('./validator/AuthenticationsValidator');
const tokenManager = require('./tokenize/TokenManager');

// playlist
const playlists = require('./api/playlists');
const playlistsService = require('./services/playlists/PlaylistsService');
const playlistValidator = require('./validator/PlaylistsValidator');

const server = hapi.server({
    port: process.env.port,
    host: process.env.host,
    routes: {
        cors: {
            origin: ['*']
        }
    }
});

async function start() {
    try {
        const albumsService = new AlbumsService();
        const songsService = new SongsService();
        const UsersService = new usersService();
        const AuthenticationsService = new authenticationsService();
        const PlaylistsService = new playlistsService();

        await server.register([{
            plugin: Jwt
        }, ]);
        server.auth.strategy('musicsapp_jwt', 'jwt', {
            keys: process.env.ACCESS_TOKEN_KEY,
            verify: {
                aud: false,
                iss: false,
                sub: false,
                maxAgeSec: process.env.ACCESS_TOKEN_AGE,
            },
            validate: (artifacts) => ({
                isValid: true,
                credentials: {
                    id: artifacts.decoded.payload.id,
                },
            }),
        });

        await server.register([
            {
                plugin: albums,
                options: {
                    service: albumsService,
                    validator: AlbumValidator
                }
            },
            {
                plugin: songs,
                options: {
                    service: songsService,
                    validator: songsValidator
                }
            },
            {
                plugin: users,
                options: {
                    service: UsersService,
                    validator: usersValidator
                }
            },
            {
                plugin: authentications,
                options: {
                    AuthenticationsService,
                    usersService,
                    tokenManager: tokenManager,
                    validator: authenticationsValidator
                }
            },
            {
                plugin: playlists,
                options: {
                    service: PlaylistsService,
                    validator: playlistValidator
                }
            },
        ]);
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
    console.log('Server running at ' + server.info.uri);
};

start()