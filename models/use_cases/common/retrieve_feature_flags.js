let fs = require("fs");
let path = require("path");

function loadJson(filename) {
    return new Promise((res, rej) => {
        let file = path.join(__dirname, `../../../config/ops/feature_flags/${filename}.json`);
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) rej(err);
            res(JSON.parse(data));
        });
    });
}

module.exports = {
    loadFeatureFlags: loadJson
};