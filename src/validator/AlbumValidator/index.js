const albumPayloadSchema = require("./schema")
const InvariantError = require('../../exceptions/InvariantError');

const AlbumValidator = {
    validateAlbumPayload: (payload) => {
        const validateResult = albumPayloadSchema.validate(payload);
        if (validateResult.error) {
            throw new InvariantError(validateResult.error.message);
        }
    }
}

module.exports = AlbumValidator;