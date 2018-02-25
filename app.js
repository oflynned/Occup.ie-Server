// setup environmental variable reading
require('dotenv').config();

let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

const config = require('./config/db');
let db = require('monk')(config.mongoUrl);

let index = require('./routes/v1/endpoints/index');
let user = require('./routes/v1/endpoints/user');
let landlord = require('./routes/v1/endpoints/landlord');
let property = require('./routes/v1/endpoints/property')(db);

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// all API requests should validate the FB authentication token if requesting restricted resources
/*
let authentication = require('./routes/v1/common/authentication');
app.use((req, res, next) => {
    authentication.validateFacebookToken(req, db)
        .then((isValidRequest) => {
            isValidRequest ? next() : res.status(401).send();
        })
});
 */

app.use('/', index);
app.use('/api/v1/user', user);
app.use('/api/v1/property', property);
app.use('/api/v1/landlord', landlord);

module.exports = app;

