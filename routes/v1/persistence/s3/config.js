const s3Config = require("../../../../config/s3");

let AWS = require("aws-sdk");
AWS.config.update(s3Config.awsCredentials);
let s3Bucket = new AWS.S3({params: s3Config.imageBucketName});

module.exports = s3Bucket;