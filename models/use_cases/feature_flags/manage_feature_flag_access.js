function areCredentialsValid(req) {
    let username = req.headers["admin_username"];
    let password = req.headers["authorization"].replace("Basic ", "");
    return username === process.env["ADMIN_USERNAME"] && password === process.env["ADMIN_PASSWORD"]
}

function filterRequests(req, res, next) {
    switch (req.method) {
        case "GET":
            next();
            break;
        default:
            if (areCredentialsValid(req))
                next();
            else
                res.status(401).send();
            break;
    }
}

module.exports = {
    filterRequests: filterRequests
};