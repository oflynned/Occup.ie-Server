module.exports = (env) => {
    let express = require('express');
    let path = require('path');
    let logger = require('morgan');
    let cookieParser = require('cookie-parser');
    let bodyParser = require('body-parser');
    let favicon = require("serve-favicon");

    let app = express();
    app.set('views', path.join(__dirname, 'website', 'html'));
    app.set('view engine', 'handlebars');
    // app.use(favicon(path.join(__dirname, 'website', 'public', 'images', 'icon.png')));

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

    app.use("/public/images", express.static(path.join(__dirname, 'website', 'public', 'images')));
    app.use("/public/content", express.static(path.join(__dirname, 'website', 'public', 'content')));
    app.use("/public/stylesheets", express.static(path.join(__dirname, 'website', 'public', 'stylesheets')));

    const config = require('./config/db');
    let db = require('monk')(config.mongoUrl);

    let index = require('./routes/v1/endpoints/index')(db, env);
    let user = require('./routes/v1/endpoints/user')(db, env);
    let rental = require('./routes/v1/endpoints/rental')(db, env);
    let landlord = require('./routes/v1/endpoints/landlord')(db, env);
    let houseShare = require('./routes/v1/endpoints/house_share')(db, env);
    let application = require('./routes/v1/endpoints/application')(db, env);

    const environment = process.env.ENVIRONMENT;
    let oauth = require("./common/oauth")(env, db);

    app.use('/', index);
    app.use('/api/v1/rental', oauth.markInvalidRequests, rental);
    app.use('/api/v1/house-share', oauth.markInvalidRequests, houseShare);

    environment === "production" ?
        app.use('/api/v1/user', oauth.denyInvalidRequests, oauth.enforceAccountOwnershipOnResourceAccess, user) :
        app.use('/api/v1/user', user);
    environment === "production" ?
        app.use('/api/v1/landlord', oauth.denyInvalidRequests, oauth.enforceAccountOwnershipOnResourceAccess, landlord) :
        app.use('/api/v1/landlord', landlord);
    environment === "production" ?
        app.use('/api/v1/application', oauth.denyInvalidRequests, oauth.enforceAccountOwnership, application) :
        app.use('/api/v1/application', application);

    return app;
};

