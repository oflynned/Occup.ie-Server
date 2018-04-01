# Backend

[![CircleCI](https://circleci.com/gh/oflynned/Occup.ie-Server/tree/master.svg?style=shield)](https://circleci.com/gh/oflynned/Occup.ie-Server/tree/master) 

Node.js backend service for better renting in Ireland because fuck Daft :smiley:

Install MongoDB and set it running in the background.

Create a `.env` file in the root of the repo containing `ENVIRONMENT="production|development"` to set the appropriate database endpoint. `production` for a remote MongoDB endpoint such as mLab with an additional environmental variable `MONGODB_URL`, `development` for a local instance running on a machine.

You'll also need a value in `.env` for `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` which are for verifying and validating Facebook OAuth bearer tokens.

More soon for S3 and Google OAuth.

Install dependencies with `npm install`, run the server with `npm start`, run tests with `npm test`, and get coverage details with `nyc npm test`.
