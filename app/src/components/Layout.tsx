/* @flow */
/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Global, css} from '@emotion/core';
import {globalStyles} from '../constants';

const Layout = ({children}: any) => {
    return (
        <>
            <Global styles={globalStyles} />
            <main
                css={css`
                    height: 100%;
                `}
            >
                {children}
            </main>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Layout;
