module.exports = (env) => {
    let express = require('express');
    let path = require('path');
    let logger = require('morgan');
    let cookieParser = require('cookie-parser');
    let bodyParser = require('body-parser');

    let app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'handlebars');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, 'public')));

    const config = require('./config/db');
    let db = require('monk')(config.mongoUrl);

    let index = require('./routes/v1/endpoints/index')(db, env);
    let user = require('./routes/v1/endpoints/user')(db, env);
    let listing = require('./routes/v1/endpoints/listing')(db, env);
    let landlord = require('./routes/v1/endpoints/landlord')(db, env);
    let application = require('./routes/v1/endpoints/application')(db, env);

    app.use('/', index);
    app.use('/api/v1/user', user);
    app.use('/api/v1/listing', listing);
    app.use('/api/v1/landlord', landlord);
    app.use('/api/v1/application', application);

    return app;
};

