const config = require('../../../../config/db');
let db = require('monk')(config.mongoUrl);

let env = process.env.ENVIRONMENT;
let collections = require("../../../../config/collections");
let collection = env === "production" ? collections.production : collections.development;

function groomDb() {
    let jobs = [];

    for (let c in collection) {
        let date = new Date();
        date = new Date(date.getFullYear(), date.getMonth(), date.getDay() - 30);

        switch (c) {
            case "applications":
                jobs.push(db.get(collection[c]).remove({
                    "$and": [
                        {last_updated: {"$lt": date}},
                        {status: "ceased"}
                    ]
                }));
                break;
            case "listings":
                jobs.push(
                    db.get(collection[c]).remove({
                        listing: {expires: {"$lt": date}}
                    }));
                break;
        }
    }

    return Promise.all(jobs)
}

groomDb();