const Joi = require("joi");

const PlaylistSongsPalyoadSchema = Joi.object({
    songId: Joi.string().required()
});

module.exports = PlaylistSongsPalyoadSchema;