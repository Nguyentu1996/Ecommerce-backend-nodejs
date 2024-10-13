'use strict'
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3Config = {
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.DEV_AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.DEV_AWS_BUCKET_SECRET_KEY,
  }
}
// a client can be shared by different commands.
const client = new S3Client(s3Config);

module.exports = {
  s3client: client,
  PutObjectCommand,
  GetObjectCommand,
  getSignedUrl,
}
