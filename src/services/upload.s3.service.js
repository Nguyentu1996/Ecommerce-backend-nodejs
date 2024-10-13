'use strict';

const { s3client, PutObjectCommand, getSignedUrl, GetObjectCommand } = require('../configs/aws-s3.config');
const { BadRequestError } = require('../core/error.response');
const crypto = require('crypto');


/////////////////////////
// Uploads an image file
/////////////////////////

const uploadImageLocalS3 = async ({ file }) => {
  try { 

    const imageName = crypto.randomBytes(16).toString('hex');
    const command = new PutObjectCommand({
      Bucket: process.env.DEV_AWS_BUCKET_NAME,
      Key: imageName || 'unknown',
      Body: file.buffer,
      ContentType: 'image/jpeg'
    })

    const getCommand = new GetObjectCommand({
      Bucket: process.env.DEV_AWS_BUCKET_NAME,
      Key: imageName
    })
    const result = await s3client.send(command)
    const url = await getSignedUrl(s3client, getCommand, { expiresIn: 3600 })

    return url;
  } catch (error) {
    throw new BadRequestError('Upload fail')
  }
}

module.exports = {
  uploadImageLocalS3,
}