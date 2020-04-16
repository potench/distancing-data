/* @flow */
/* eslint-disable import/prefer-default-export */
export const getUrlParameterByName = (name, url) => {
    const location = url || window.location.href;
    const replacedName = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${replacedName}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(location);
    if (!results) return null;
    if (!results[2]) return '';
    return window.decodeURIComponent(results[2].replace(/\+/g, ' '));
};
