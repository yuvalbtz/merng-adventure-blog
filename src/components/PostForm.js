import React from 'react';
import { Button, Form} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    title:'',
    body: '',
    imagePost:''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.title = ''
      values.body = '';
      values.imagePost = '';
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            width="13"
            placeholder="title.."
            name="title"
            onChange={onChange}
            value={values.title}
            error={error ? true : false}
          />
           <Form.Input
            width="13"
            placeholder="image link.."
            name="imagePost"
            onChange={onChange}
            value={values.imagePost}
            error={error ? true : false}
          />
          <Form.TextArea
            width="13"
            placeholder="body.."
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          
          <Button type="submit" color="teal">
            Add a post
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($title:String! $body: String! $imagePost:String!) {
    createPost(title:$title body: $body imagePost:$imagePost) {
      id
      title
      body
      createdAt
      username
      imagePost
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
