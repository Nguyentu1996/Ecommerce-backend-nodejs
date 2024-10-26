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
    // const url = await getSignedUrl(s3client, getCommand, { expiresIn: 3600 }); s3
    const result = await s3client.send(command)
    const cloudfrontUrl = `${process.env.DEV_AWS_CLOUDFRONT_URL}/${imageName}`
    const url = await getSignedUrl(
      {
        url: cloudfrontUrl,
        keyPairId: process.env.DEV_AWS_CLOUDFRONT_PUBLIC_KEY_ID,
        dateLessThan: new Date(Date.now() + 1000 * 3600 ),
        privateKey: process.env.DEV_AWS_CLOUDFRONT_PRIVATE_KEY,
      }
    );

    return {
      result,
      url,
    };
  } catch (error) {
    throw new BadRequestError('Upload fail')
  }
}

module.exports = {
  uploadImageLocalS3,
}