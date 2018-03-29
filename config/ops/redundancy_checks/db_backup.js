const exec = require('child_process');
const config = require('../../db');

function backupDb() {
    let timestamp = new Date();
    let filename = "full_db_backup_" + timestamp + ".gz";
    let cmd = [`-h localhost:27017 -d RentAppDevelopment --authenticationDatabase admin -o - | gzip > ${filename}`];
    exec.exec("mongodump -d RentAppDevelopment -o .; tar -cv RentAppDevelopment | gzip > archive.gz", {detached: true});
}

function restoreDb(timestamp, collection = null) {

}

backupDb();