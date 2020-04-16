/* @flow */
/**
 * experiment.js
 * 
 * example usage:
 * 
 * ```
 * import {experimentConfig, isExperiment} from '../experimentFramework/experiment.js'
 * ...
 * const config = experimentConfig()
 * if (isExperiment(config, 'some-exp-id')) {
 *     // do stuff related to some-exp-id experiment
 * } else if (isExperiment(config, 'control')) {
 *    // do stuff related to control experiment
 * }
 * ```
 * 
 */

import {getUrlParameterByName} from '../util/url';

const conf = require('./experimentConfig.json');

export const getWeightedIndexList = configs => {
    return configs.reduce((acc, config, idx) => {
        const weightedList = [...acc];
        const {weight} = config;
        for (let i = 0; i < weight; i += 1) {
            weightedList.push(idx);
        }
        return weightedList;
    }, []);
};

// Fisher-Yates shuffle
export const shuffle = array => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const randIdx = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        const t = arr[i];
        arr[i] = arr[randIdx];
        arr[randIdx] = t;
    }
    return arr;
};

export const getWeightedExperiment = expConfigs => {
    const weightedIndexList = getWeightedIndexList(expConfigs);
    const shuffledWeightedIndexList = shuffle(weightedIndexList);
    const weightedIndex = shuffledWeightedIndexList[0];
    return expConfigs[weightedIndex];
};

export const getExperimentConfig = config => {
    const defaults = {...config};
    delete defaults.experiments;
    const {experiments} = config;
    if (experiments) {
        const featureFlag = getUrlParameterByName('exp') || '';
        if (featureFlag) {
            const forcedConfig = experiments.filter(
                exp => exp.experimentId.toLowerCase() === featureFlag.toLowerCase()
            )[0];
            if (forcedConfig) {
                return Object.assign(defaults, forcedConfig);
            }
        }
        const exp = getWeightedExperiment(experiments);
        // experiment flags should override default flags
        return Object.assign(defaults, exp);
    }
    // if no experiment config found for a certain browser, return defaults
    return defaults;
};

export const experimentConfig = () => {
    return getExperimentConfig(conf);
};

export const isExperiment = (config, experimentId) => {
    return config && config.experimentId && config.experimentId.toLowerCase() === experimentId.toLowerCase();
};
