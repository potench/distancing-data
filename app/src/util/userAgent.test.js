/* @flow */
import {getUserAgent, isChrome} from './userAgent';

describe('userAgent', () => {
    it('getUserAgent should detect mock userAgent as "chrome"', () => {
        expect(getUserAgent()).toEqual('chrome');
    });
    it('isChrome should return true for mock userAgent', () => {
        expect(isChrome()).toEqual(true);
    });
});
