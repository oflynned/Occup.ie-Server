const IMAGE_BUCKET = process.env.S3_BUCKET_NAME;
const DB_BACKUP_BUCKET = process.env.DB_BUCKET_NAME;

module.exports = {
    get imageBucketName() {
        return IMAGE_BUCKET
    },
    get dbBucketName() {
        return DB_BACKUP_BUCKET
    },
    get awsCredentials() {
        return {
            accessKeyId: process.env.S3_ROOT_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_ROOT_SECRET_ACCESS_KEY,
            region: process.env.REGION
        }
    }
};