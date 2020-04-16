/* @flow */
const env = require('./src/env');

// DEFAULTS (defaults to DEV)
let url = `http://test.distancingdata.org`;
let bucketName = `test.distancingdata.org`;

if (env.IS_PROD) {
    url = `https://www.distancingdata.org`;
    bucketName = `distancingdata.org`;
}
if (env.IS_STAGE) {
    url = `https://stage.distancingdata.org`;
    bucketName = `stage.distancingdata.org`;
}

const siteAddress = new URL(url);

const s3Config = {
    bucketName,
    protocol: siteAddress.protocol.slice(0, -1),
    hostname: siteAddress.hostname
};

module.exports = {
    s3Config,
    siteAddress
};
