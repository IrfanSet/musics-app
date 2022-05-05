/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlists', {
        id: {
            type: 'varchar(50)',
            primaryKey: true
        },
        name: {
            type: 'varchar(50)',
            notNull: true
        },
        owner: {
            type: 'varchar(50)',
            notNull: true
        }
    });

    pgm.addConstraint('playlists', 'playlist_fk', {
        foreignKeys: {
            columns: 'owner',
            references: 'users'
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('playlists')
};
