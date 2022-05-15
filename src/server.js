require('dotenv').config();
const hapi = require('@hapi/hapi');
const AlbumsService = require('./services/albums/AlbumsService');
const albums = require('./api/albums');
const SongsService = require('./services/songs/SongsService');
const songs = require('./api/songs');
const AlbumValidator = require('./validator/AlbumValidator');
const songsValidator = require('./validator/SongValidator');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// users
const users = require('./api/users');
const UsersService = require('./services/users/UsersService');
const usersValidator = require('./validator/UsersValidator');

// authentocations
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/authentications/AuthenticationsService');
const authenticationsValidator = require('./validator/AuthenticationsValidator');
const tokenManager = require('./tokenize/TokenManager');

// playlist
const playlists = require('./api/playlists');
const playlistsService = require('./services/playlists/PlaylistsService');
const playlistValidator = require('./validator/PlaylistsValidator');

// playlist songs
const playlistSongs = require('./api/playlist_songs');
const PlaylistSongService = require('./services/playlist_song/PlaylistSongsService');
const playlistSongValidator = require('./validator/PlaylistSongValidator');

// uploads 
const uploads = require('./api/uploads');
const storageService = require('./services/storage/StorageService');
const uploadsValidator = require('./validator/uploads');

//exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// album likes
const albumLikes = require('./api/albumLikes');
const AlbumLikesService = require('./services/albumLikes/AlbumLikesService');

// cache
const CacheService = require('./services/redis/CacheService');

const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
        const usersService = new UsersService();
        const authenticationService = new AuthenticationsService();
        const PlaylistsService = new playlistsService();
        const playlistSongService = new PlaylistSongService;
        const StorageService = new storageService(path.resolve(__dirname, 'api/uploads/file/images'));
        const cacheService = new CacheService();
        const albumLikesService = new AlbumLikesService(cacheService);

        await server.register([{
                plugin: Jwt
            },
            {
                plugin: Inert
            }
        ]);
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

        await server.register([{
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
                    service: usersService,
                    validator: usersValidator
                }
            },
            {
                plugin: authentications,
                options: {
                    authenticationService,
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
            {
                plugin: playlistSongs,
                options: {
                    playlistSongService,
                    songsService,
                    PlaylistsService,
                    validator: playlistSongValidator
                }
            },
            {
                plugin: uploads,
                options: {
                    service: StorageService,
                    validator: uploadsValidator,
                    albumService: albumsService
                }
            },
            {
                plugin: _exports,
                options: {
                    service: ProducerService,
                    validator: ExportsValidator,
                    playlistService: PlaylistsService
                }
            },
            {
                plugin: albumLikes,
                options: {
                    service: albumLikesService
                }
            }
        ]);
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
    console.log('Server running at ' + server.info.uri);
};

start()