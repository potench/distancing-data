/* @flow */
import React from 'react';
import {css} from '@emotion/core';

import Layout from '../components/Layout';
import SEO from '../components/Seo';

const NotFoundPage = () => (
    <Layout>
        <SEO title="404: Not found" />
        <div
            css={css`
                padding: 1rem;
                max-width: 500px;
            `}
        >
            <div>
                <h1>404</h1>
                <h1>NOT FOUND</h1>
                <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
            </div>
        </div>
    </Layout>
);

export default NotFoundPage;
