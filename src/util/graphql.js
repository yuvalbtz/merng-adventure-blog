import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      title
      body
      createdAt
      username
      imagePost
      likeCount
      likes {
        username
        
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
