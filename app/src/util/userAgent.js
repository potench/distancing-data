/* @flow */
/* eslint-disable import/prefer-default-export */
export const getUserAgent = () => {
    const regex = /chrome|firefox|safari/i;
    let ua = 'unsupported';
    const {userAgent} = window.navigator;
    if (userAgent.match(regex)) {
        [ua] = userAgent.match(regex);
    }
    return ua.toLowerCase();
};

export const isChrome = () => {
    return getUserAgent().toLowerCase() === 'chrome';
};

export const isFirefox = () => {
    return getUserAgent().toLowerCase() === 'firefox';
};

export const isUnsupported = () => {
    return getUserAgent().toLowerCase() === 'unsupported';
};
