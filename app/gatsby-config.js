/* @flow */
const {s3Config} = require('./s3config.js');

const stuff = {
    siteMetadata: {
        // you can pipe in CMS data here or any other data you want to hydrate templates with during build
        // you will then be able to query this data with useStaticQuery in templates
        title: `Daily infection counts, rates, and predictions for the covid-19 coronavirus by region.`,
        siteUrl: `https://www.distancingdata.org`,
        description: `Global and Local Live Updates Covid-19 / Coronavirus Case Information`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: 'gatsby-plugin-react-svg',
            options: {
                rule: {
                    include: /images/
                }
            }
        },
        // `gatsby-transformer-json`,
        // {
        //     resolve: `gatsby-source-filesystem`,
        //     options: {
        //         path: `./static/daystest/`,
        //     },
        // },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`
            }
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/favicon.png` // This path is relative to the root of the site.
            }
        },
        {
            resolve: `gatsby-plugin-s3`,
            options: {
                ...s3Config
            }
        },
        `gatsby-plugin-emotion`,
        `gatsby-plugin-typescript`,
        `gatsby-plugin-sass`
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
    ]
};

module.exports = stuff;
