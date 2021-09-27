import React from 'react';
import { Button, Card, Form, Image} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { CircularProgress, IconButton } from '@material-ui/core';
import Icon from '@material-ui/icons/AddAPhotoOutlined'
import Axios from 'axios'

function PostForm() {
 const formData = new FormData()
  const [loading, setLoading] = React.useState(false)
  const [fileSelected, setFileSelected] = React.useState('')
 
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
      setFileSelected('')
    }
  });

  function createPostCallback() {
    createPost();
  }


 


  function handleFileChanged(e){
    e.preventDefault() 
    setLoading(true)

    formData.append('file', e.target.files[0])
      formData.append('upload_preset','temed3va')
    
      Axios.post("https://api.cloudinary.com/v1_1/dw4v5axnj/image/upload/",formData)
      .then(res => {
        setFileSelected(res.data.secure_url) 
        console.log(res.data);
        setLoading(false)
        values.imagePost = res.data.secure_url
        
     }).catch(err => console.log(err)) 
    
     
    console.log('loading', loading);
   
   
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
        
        <input name="file" accept="image/*" hidden id={`icon-button-file-image`} type="file" onChange={handleFileChanged} />
        <label htmlFor={`icon-button-file-image`}  >
       <IconButton color='inherit' size='small' disabled={loading} style={{backgroundColor:'white'}} aria-label="upload picture" component="span">
      { loading ?  <CircularProgress color='secondary' size={20}/> : <Icon  /> } 
        </IconButton>
       </label>
    
       {fileSelected && ( <Card>
        <Image src={fileSelected} wrapped ui={false} />
      </Card>)}
        
     
        
        
        
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
