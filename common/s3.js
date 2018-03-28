const s3Config = require("../config/s3");
let AWS = require("aws-sdk");

module.exports = () => {
    AWS.config.update(s3Config.awsCredentials);
    return new AWS.S3({params: s3Config.dbBucketName});
};