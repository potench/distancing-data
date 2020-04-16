/* @flow */
/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// eslint-disable-next-line no-unused-vars
function SEO({description, lang, meta, title}) {
    return (
        <Helmet
            htmlAttributes={{
                lang
            }}
            title={title}
            titleTemplate={`Distancing Data | ${title}`}
            meta={[
                {
                    name: `description`,
                    content: description
                },
                {
                    property: `og:title`,
                    content: title
                },
                {
                    property: `og:description`,
                    content: description
                },
                {
                    property: `og:type`,
                    content: `website`
                },
                {
                    name: `twitter:card`,
                    content: `summary`
                },
                // {
                //     name: `twitter:creator`,
                //     content: site.siteMetadata.author
                // },
                {
                    name: `twitter:title`,
                    content: title
                },
                {
                    name: `twitter:description`,
                    content: title
                },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                }
            ].concat(meta)}
        >
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-87949-17" />
            <script>{`
                try {
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag(\'js\', new Date());
                    gtag(\'config\', \'UA-87949-17\');
                } catch (e) {}
            `}</script>
        </Helmet>
    );
}

SEO.defaultProps = {
    lang: `en`,
    meta: [],
    description: ``
};

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired
};

export default SEO;
