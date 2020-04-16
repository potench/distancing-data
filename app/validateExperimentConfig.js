#!/usr/bin/env node
const EXPERIMENT_FOLDER_PATH = './src/experimentFramework';
const EXPERIMENT_CONFIG_NAME = 'experimentConfig.json';
const EXPERIMENT_SCHEMA_NAME = 'experimentConfig.schema.json';

const colors = require('colors');
const Ajv = require('ajv');

const experimentConfig = require(`${EXPERIMENT_FOLDER_PATH}/${EXPERIMENT_CONFIG_NAME}`);
const schema = require(`${EXPERIMENT_FOLDER_PATH}/${EXPERIMENT_SCHEMA_NAME}`);

const ajv = new Ajv();
const validate = ajv.compile(schema);
const valid = validate(experimentConfig);

console.log(`Validating ${EXPERIMENT_CONFIG_NAME} with json-schema: ${EXPERIMENT_SCHEMA_NAME}...`.green.bold);
if (!valid) {
    console.log(`Error validating ${EXPERIMENT_CONFIG_NAME} with ${EXPERIMENT_SCHEMA_NAME}: \n`.red, validate.errors);
    process.exit(1);
} else {
    console.log(`${EXPERIMENT_CONFIG_NAME} json-schema validation complete! No errors!`);
}
