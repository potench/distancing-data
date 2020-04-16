/* @flow */
const conf = require('./experimentConfig.json');
/**
 * NOTE: schema validations happen in validateExperimentConfig.js which validates
 * the config against experimentConfig.schema.json
 */

describe('experimentConfig.js', () => {
    const {experiments} = conf;

    it('experimentConfig.json experiment weights should add up to exactly 100', () => {
        const weightTotal = experiments.reduce((total, exp) => {
            const {weight} = exp;
            return total + weight;
        }, 0);
        expect(weightTotal).toEqual(100);
    });
});
