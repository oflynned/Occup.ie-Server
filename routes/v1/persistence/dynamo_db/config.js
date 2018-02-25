let dynamo = require('dynamodb');

dynamo.AWS.config.update({
    accessKeyId: process.env.S3_ROOT_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ROOT_SECRET_ACCESS_KEY,
    region: process.env.REGION
});

module.exports = dynamo;