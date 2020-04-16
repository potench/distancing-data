/* @flow */
/* eslint-disable camelcase */
import {getWeightedIndexList, shuffle, getWeightedExperiment, getExperimentConfig} from './experiment';

describe('experiment', () => {
    const testConfig = {
        display_checkbox: false,
        experiments: [
            {
                experimentId: 'chrome-exp-1',
                display_checkbox: true,
                something_else: false,
                weight: 20
            },
            {
                experimentId: 'chrome-exp-2',
                display_checkbox: true,
                weight: 80
            }
        ]
    };
    const testUA = 'chrome';
    const {experiments} = testConfig;
    const expConfig = experiments[testUA];
    const weightedIndexList = getWeightedIndexList(experiments);
    const shuffledWeightedIndexList = shuffle(weightedIndexList);

    it('getWeightedIndexList should return an array of 100 array indexes', () => {
        expect(weightedIndexList).toHaveLength(100);
        weightedIndexList.forEach(num => {
            expect(typeof num).toEqual('number');
            expect(num).toBeLessThan(weightedIndexList.length);
        });
    });

    it('getWeightedIndexList should contain a number of indexes according to weight', () => {
        const expConfigWeightsMap = experiments.reduce((acc, config, index) => {
            acc[index] = config.weight;
            return acc;
        }, {});
        const weightedIndexListWeightsMap = weightedIndexList.reduce((acc, idx) => {
            if (acc[idx]) {
                acc[idx] += 1;
            } else {
                acc[idx] = 1;
            }
            return acc;
        }, {});
        expect(expConfigWeightsMap).toEqual(weightedIndexListWeightsMap);
    });

    it('shuffle should return an array of randomly shuffled array elements', () => {
        expect(shuffledWeightedIndexList).not.toEqual(weightedIndexList);
    });

    it('getWeightedExperiment and getExperimentConfig should return different experiments occasionally according to weight', () => {
        const result1 = [];
        const result2 = [];
        for (let i = 0; i < 100; i += 1) {
            result1.push(getWeightedExperiment(experiments).experimentId);
            result2.push(getExperimentConfig(testConfig).experimentId);
        }
        const someConfigsAreDifferent1 = result1.some(id => id !== 'chrome-exp-2');
        const someConfigsAreDifferent2 = result2.some(id => id !== 'chrome-exp-2');
        expect(someConfigsAreDifferent1).toBe(true);
        expect(someConfigsAreDifferent2).toBe(true);
    });

    it('getExperimentConfig should return a config based on its proper weight over 1000 tries', () => {
        const TOTAL = 1000;
        const result = [];
        for (let i = 0; i < TOTAL; i += 1) {
            result.push(getExperimentConfig(testConfig));
        }
        const expected = result.reduce((acc, config) => {
            const {experimentId} = config;
            if (acc[experimentId]) {
                acc[experimentId] += 1;
            } else {
                acc[experimentId] = 1;
            }
            return acc;
        }, {});
        const percentageExp1 = (expected['chrome-exp-1'] / TOTAL) * 100;
        const percentageExp2 = (expected['chrome-exp-2'] / TOTAL) * 100;
        const lowerPercentage = Math.round(percentageExp1 / 10) * 10;
        const higherPercentage = Math.round(percentageExp2 / 10) * 10;
        const {experiments} = testConfig;
        const {weight: chromeExp1Weight} = experiments.find(exp => {
            return exp.experimentId === 'chrome-exp-1';
        });
        const {weight: chromeExp2Weight} = experiments.find(exp => {
            return exp.experimentId === 'chrome-exp-2';
        });
        expect(lowerPercentage).toEqual(chromeExp1Weight);
        expect(higherPercentage).toEqual(chromeExp2Weight);
    });

    it('getExperimentConfig should override defaults', () => {
        const {display_checkbox} = getExperimentConfig(testConfig);
        expect(display_checkbox).toEqual(true);
    });
});
