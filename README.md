# Backend

[![CircleCI](https://circleci.com/gh/oflynned/Occup.ie-Server/tree/master.svg?style=shield)](https://circleci.com/gh/oflynned/Occup.ie-Server/tree/master) 

Node.js backend service for better renting in Ireland because fuck Daft :smiley:

## Quick Start

1. Clone this repo
2. Run `git submodule update --init --recursive` to pull all submodule dependencies
3. Run `npm install` to grab all dependencies
4. Run `npm start` and head to `http://localhost:3000` - you should see the occup.ie homepage :tada:

## Developer Start

Clone the repo and init submodules `git submodule update --init --recursive`

Install MongoDB with Brew and set it running in the background.

Create a `.env` file in the root of the repo containing `ENVIRONMENT="production|development"` to set the appropriate database endpoint & access levels. `production` for a remote MongoDB endpoint such as mLab with an additional environmental variable `MONGODB_URL`, `development` for a local instance running on a machine. `development` does not check OAuth in the local environment to allow for easier debugging and data viewing with more relaxed security measures, while `production` checks every request via the provider and marks/restricts invalid requests through router middleware chains.

You'll also need a value in `.env` for `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` which are for verifying and validating Facebook OAuth bearer tokens. Google and S3 tokens are yet to be implemented. 

Install dependencies with `npm install`, run the server with `npm start`, run tests with `npm test`, and get coverage details with `nyc npm test`.
