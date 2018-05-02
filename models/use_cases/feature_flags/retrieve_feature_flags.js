let fs = require("fs");
let path = require("path");
let featureFlag = require("../../feature_flag");

function loadJson(filename) {
    if (filename === "*")
        return loadAllJson();

    return new Promise((res, rej) => {
        let file = path.join(__dirname, `../../../config/ops/feature_flags/${filename}.json`);
        fs.readFile(file, "utf8", (err, data) => {
            if (err) rej(err);
            res(JSON.parse(data));
        });
    });
}

function loadAllJson() {
    return new Promise((res, rej) => {
        const flagsLocation = "../../../config/ops/feature_flags";
        let jsonPath = path.join(__dirname, flagsLocation);
        let output = {};
        fs.readdirSync(jsonPath, "utf8").forEach((fileName) => {
            let file = path.join(__dirname, `${flagsLocation}/${fileName}`);
            let data = JSON.parse(fs.readFileSync(file));
            Object.assign(output, data);
        });
        res(output);
    });
}

module.exports = {
    loadFeatureFlags: loadJson,
    loadAllJson: loadAllJson
};