/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('user_album_likes', {
        id: {
            type: 'text',
            primaryKey: true
        },
        user_id: {
            type: 'text',
            notNull: true
        },
        album_id: {
            type: 'text',
            notNull: true
        }
    });

    pgm.addConstraint('user_album_likes', 'user_id_fk', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users'
        }
    });
    pgm.addConstraint('user_album_likes', 'album_id_fk', {
        foreignKeys: {
            columns: 'album_id',
            references: 'albums'
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('user_album_likes');
};
