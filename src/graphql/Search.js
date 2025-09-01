import gql from 'graphql-tag';

export default gql`query($query:String!, $pageCursor:String) {
  search(query:$query, type:ISSUE_ADVANCED, first:15, after:$pageCursor) {
    edges {
      node {
        ...on Issue {
          id,
          title,
          url,
          author {
            avatarUrl(size: 40),
            login,
            url
          }
          state,
          createdAt,
          repository {
            id,
            name,
            url
          },
          labels(first:10) {
            nodes {
              id,
              name,
              color
            }
          },
          participants(first:11) {
            nodes {
              avatarUrl,
              login,
              url,
            }
          }
        }
        ...on PullRequest {
          id,
          title,
          url,
          author {
            avatarUrl(size: 40),
            login,
            url
          }
          state,
          createdAt,
          repository {
            id,
            name,
            url
          },
          labels(first:10) {
            nodes {
              id,
              name,
              color
            }
          },
          participants(first:11) {
            nodes {
              avatarUrl,
              login,
              url,
            }
          }
        }
      }
    }
    issueCount
    pageInfo {
      endCursor,
      hasNextPage
    }
  }
}`;
