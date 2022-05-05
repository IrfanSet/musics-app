/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'varchar(50)',
            primaryKey: true
        },
        playlist_id: {
            type: 'varchar(50)',
            notNull: true
        },
        song_id: {
            type: 'varchar(50)',
            notNull: true
        }
    });

    pgm.addConstraint('playlist_songs', 'playlistId_fk', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists'
        }
    });

    pgm.addConstraint('playlist_songs', 'songId_fk', {
        foreignKeys: {
            columns: 'song_id',
            references: 'songs'
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('playlist_songs');
};
