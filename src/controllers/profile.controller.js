'use strict'

const { SuccessResponse } = require("../core/success.response");

class ProfileController {
    viewProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success',
            metadata: null,
        }).send(res);
    }
}

module.exports = new ProfileController();
