/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

/*
const path = require('path');

exports.onCreateNode = ({ node }) => {
  console.log(node.internal.type)
}


exports.createPages = async ({graphql, actions, reporter}) => {

    const { createPage } = actions;
    const result = await graphql(
        `
        {
            allDayJson(limit: 1000) {
                edges {
                    node {
                        region
                    }
                }
            }
        }
        `
    );

    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`)
        return
    }

    // Create image post pages.
    const postTemplate = path.resolve(`src/pages/day.js`)
    // We want to create a detailed page for each
    // Instagram post. Since the scraped Instagram data
    // already includes an ID field, we just use that for
    // each page's path.
    result.data.allPostsJson.edges.forEach(edge => {
        // Gatsby uses Redux to manage its internal state.
        // Plugins and sites can use functions like "createPage"
        // to interact with Gatsby.
        createPage({
        // Each page is required to have a `path` as well
        // as a template component. The `context` is
        // optional but is often necessary so the template
        // can query data specific to each page.
        path: `/${slug(edge.node.id)}/`,
        component: slash(postTemplate),
        context: {
            id: edge.node.id,
        },
        })
    })
};
*/
