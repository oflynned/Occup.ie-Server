function areCredentialsValid(req) {
    let username = req.headers["admin_username"];
    let password = req.headers["authorization"].replace("Basic ", "");
    return username === process.env["ADMIN_USERNAME"] && password === process.env["ADMIN_PASSWORD"]
}

function filterRequests(req, res, next) {
    switch (req.method) {
        case "GET":
            return next;
        default:
            if (areCredentialsValid(req))
                return next;
            else
                throw new Error("bad_credentials");
    }
}

module.exports = {
    filterRequests: filterRequests
};