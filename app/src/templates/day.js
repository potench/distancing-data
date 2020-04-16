import * as PropTypes from "prop-types"
import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layouts"

class DayTemplate extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      daysJson: PropTypes.object.isRequired,
    }),
  }
  render() {
    return (
      <Layout location={this.props.location}>
        HI IM A DAY 
      </Layout>
    )
  }
}

export default PostTemplate

// The post template's GraphQL query. Notice the “id”
// variable which is passed in. We set this on the page
// context in gatsby-node.js.
//
// All GraphQL queries in Gatsby are run at build-time and
// loaded as plain JSON files so have minimal client cost.
// export const dayQuery = graphql`
//   query($id: String!) {
//     # Select the post which equals this id.
//     daysJson(id: { eq: $id }) {
//       ...PostDetail_details
//     }
//   }
// `
