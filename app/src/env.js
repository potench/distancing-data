const ENV = process.env.ENV;

const IS_DEV = ENV === 'development';

const IS_STAGE = ENV === 'stage';

const IS_PROD = ENV === 'production';

module.exports = {
    IS_DEV: IS_DEV,
    IS_STAGE: IS_STAGE,
    IS_PROD: IS_PROD
};
