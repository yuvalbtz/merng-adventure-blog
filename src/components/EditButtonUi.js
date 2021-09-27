import React from 'react'
import { Button, Form, Icon } from 'semantic-ui-react'
import MyPopup from '../util/MyPopup'
import {Header, Image, Modal } from 'semantic-ui-react'
import { CircularProgress, IconButton } from '@material-ui/core'
import IconAdd from '@material-ui/icons/AddAPhotoOutlined'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import Axios from 'axios'
import { useForm } from '../util/hooks';
function EditButton({post:{id,title,imagePost, body}}) {
   const formData = new FormData()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [fileSelected, setFileSelected] = React.useState('')
 
  const { values, onChange, onSubmit } = useForm(updatePostCallback, {
    id,
    title,
    body,
    imagePost
  });


  const [updatePost] = useMutation(DELETE_COMMENT_MUTATION, {
    
       refetchQueries:[{query:FETCH_POSTS_QUERY, 
        variables:{
            postId:id,
            title:values.title,
            body:values.body,
            imagePost:values.imagePost, 
          }
        }
    ],
       onCompleted:() => {
        values.title = title
        setFileSelected("")
        values.body = body
        

        setOpen(false)
       },
       onError:(err) => console.log(err),
   
       variables:{
        postId:id,
        title:values.title,
        body:values.body,
        imagePost:values.imagePost, 
      }
  });
  
  function updatePostCallback() {
    updatePost();
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
  
function buttonDisabled(){
  if(values.title.trim() === title.trim() && values.body.trim() === body.trim() && fileSelected.trim() === ''){
    return true
  }else if(values.title.trim() === "" || values.body.trim() === "" ){
    return true
  }
   return false
}

  return (
        <>
        <MyPopup content="Edit Post">
           <Button
          as="div"
          color='grey'
          floated="right"
          onClick={() => setOpen(true)}
         
        >
          <Icon name="edit" style={{ margin: 0 }} />
        </Button>  
        </MyPopup>
         <Modal
         onClose={() => setOpen(false)}
         onOpen={() => setOpen(true)}
         open={open}
        
       >
        
    
      
        
         <Modal.Header>Update a Post </Modal.Header>
         <input name="file" accept="image/*" hidden id={`icon-button-file-image-update`} type="file" onChange={handleFileChanged} />
        <label htmlFor={`icon-button-file-image-update`}  >
       <IconButton  color='inherit' size='medium' disabled={loading} style={{position:'absolute', bottom:10, left:15}} aria-label="upload picture" component="span">
        
       { loading ?  <CircularProgress color='secondary' size={20}/> : <IconAdd  /> } 
        </IconButton>
       </label>
         
         <Modal.Content  image>
           <Image style={{height:'500px', width:'600px'}}  src={ fileSelected  ? fileSelected : imagePost} />
           <Modal.Description>
            
           <Form onSubmit={onSubmit}>
            <Form.Field>
             <Header> 
               
          <Form.Input
           
            placeholder="title.."
            name="title"
            onChange={onChange} 
            value={values.title}
            
          />
          </Header>
  
            
            
            
            <Form.TextArea
            
            placeholder="body.."
            name="body"
             onChange={onChange}
            value={values.body}
            rows={20}
           
          />
          </Form.Field>
           </Form>  
           </Modal.Description>
         </Modal.Content>
        
         <Modal.Actions>
           <Button color='black' onClick={() => setOpen(false)}>
             Cancel
           </Button>
           <Button
             content="Update!"
             labelPosition='right'
             disabled={buttonDisabled()}
             icon='checkmark'
             onClick={() => updatePostCallback()}
             positive
           />
         </Modal.Actions>
         
  
       </Modal>
       </>
    )
}

export default EditButton


const DELETE_COMMENT_MUTATION = gql`
  mutation updatePost($postId: ID!, $title: String!, $body:String!, $imagePost:String!) {
    updatePost(postId: $postId, title: $title, body:$body, imagePost:$imagePost) {
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