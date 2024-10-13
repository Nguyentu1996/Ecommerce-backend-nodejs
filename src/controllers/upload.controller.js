'use strict'

const { BadRequestError } = require("../core/error.response");
const { CREATED } = require("../core/success.response");
const { uploadImageLocal, uploadImageLocalMultipleFiles } = require("../services/upload.service");

class UploadController {
  uploadImageLocal = async (req, res, next) => {
    const { file } = req
    if (!file) {
      throw new BadRequestError('File not found')
    }

    new CREATED({
      message: 'Upload New Products Success',
      metadata: await uploadImageLocal({
        path: file.path
      }),
    }).send(res);
  }

  uploadImageLocalMultipleFiles = async (req, res, next) => {
    const { files } = req
    if (!files.length) {
      throw new BadRequestError('Files not found')
    }

    new CREATED({
      message: 'Upload New Products Success',
      metadata: await uploadImageLocalMultipleFiles({
        files: files
      }),
    }).send(res);
  }
}

module.exports = new UploadController()
