const InvariantError = require("../../exceptions/InvariantError");
const PlaylistSongsPalyoadSchema = require("./schema")


const PlaylistSongValidator = {
    validatePlaylistSongPayload: (payload) => {
        const validateResult = PlaylistSongsPalyoadSchema.validate(payload);
        if (validateResult.error) {
            throw new InvariantError(validateResult.error.message);
        }
    }
}
module.exports = PlaylistSongValidator;