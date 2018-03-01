function createBucketItem() {
    let imagePath = path.join(process.cwd(), "public", "images", "michael_d.jpg");
    let fileContents = fs.readFileSync(imagePath);

    let s3Data = {Key: uuid.v4() + ".jpg", Body: fileContents};
    let s3Promise = bucket.putObject(s3Data).promise();

    Promise.all([s3Promise])
        .then((data) => {
            res.status(201);
            res.send({guid: s3Data.Key});
        })
        .catch((err) => {
            res.status(500);
            res.send(err);
        });
}

function readBucketItems() {
    bucket.listObjects({Bucket: process.env.S3_BUCKET_NAME}).promise().then((data) => {
            let promises = [];
            for (let i = 0; i < data.Contents.length; i++) {
                let urlParams = {Bucket: data.Name, Key: data.Contents[i].Key};
                promises.push(
                    new Promise((res, rej) => {
                        bucket.getSignedUrl('getObject', urlParams, (err, data) => {
                            err !== null ? rej(err) : res(data);
                        })
                    })
                );
            }

            Promise.all(promises)
                .then(data => {
                    res.status(200);
                    res.json(data);
                }).catch(err => {
                res.status(500);
                res.send(err);
            });
        }
    ).catch(err => {
        res.status(500);
        res.json(err);
    });
}
