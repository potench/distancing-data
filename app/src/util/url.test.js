/* @flow */
import {getUrlParameterByName} from './url';

describe('url', () => {
    const url = 'https://distancingdata.com/?test=1';

    it('getUrlParameterByName gets a url parameter by name', () => {
        expect(getUrlParameterByName('test', url)).toEqual('1');
    });
});
