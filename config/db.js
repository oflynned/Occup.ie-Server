const DB_NAME = "RentAppDevelopment";

module.exports = {
    get dbName() {
        return DB_NAME;
    },
    
    get mongoUrl() {
        let developmentUrl = `mongodb://localhost:27017/${DB_NAME}`;
        let productionUrl = process.env.MONGODB_URL + `/${DB_NAME}`;
        return process.env.ENVIRONMENT === "production" ? productionUrl : developmentUrl;
    }
};