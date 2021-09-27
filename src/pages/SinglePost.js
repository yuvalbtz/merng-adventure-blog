import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import {
  Button,
  Form,
  Grid,
  Card as Cardi,
  Icon,
  Label
  
} from 'semantic-ui-react';

 import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import PlaceIcon from '@material-ui/icons/Place'
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import SkeletonPost from '../components/SkeletonPost';
import Fade from '@material-ui/core/Fade';
import DeleteButtonUi from '../components/DeleteButtonUi';
import EditButtonUi from '../components/EditButtonUi';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height:'auto'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  titleText:{
      textOverflow:"elipsis",
      whiteSpace:"nowrap",
      overflow:"hidden"
  },
  
}));



function SinglePost(props) {
  const classes = useStyles();
  
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const {
    data: { getPost }
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup;
  if (!getPost) {
    postMarkup =(<SkeletonPost/>)
  } else {
    const {
      id,
      title,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
      imagePost,
    } = getPost;


    const updatePost = {
      id,
      title,
      imagePost,
      body
    }


    postMarkup = (
      <Fade in={true}>
      <Grid>
     <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
        }
      
        title={`published by ${username}`}
        subheader={`${moment(createdAt).fromNow(false)}`}
      />
       <CardContent className={classes.titleText}>
       <Typography variant="h6" color="textPrimary" component="h6">
       <PlaceIcon/>{title}
        </Typography>
        </CardContent>
        {imagePost && (<CardMedia
        className={classes.media}
        image={imagePost}
        title={title}
      />)}
      <CardContent style={{wordBreak:"break-word"}}>
        <Typography variant="body2" color="textSecondary" component="p">
         {body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
      <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Button as={'div'} labelPosition="right">
            <Button color="blue" basic >
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
          {user && user.username === username && <EditButtonUi post={updatePost} callback={deletePostCallback} />}
        {user && user.username === username && <DeleteButtonUi postId={id} callback={deletePostCallback} />}
      </CardActions>
     </Card>
            {user && (
              <Cardi fluid style={{marginBottom:'10px'}}>
                <Cardi.Content>
                  <p>Post a comment:</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Add
                      </button>
                    </div>
                  </Form>
                </Cardi.Content>
              </Cardi>
            )}
            {comments.map((comment) => (
              <Cardi fluid key={comment.id}  style={{marginBottom:'10px'}}>
                <Cardi.Content>
               {user && user.username === comment.username && (
                    <DeleteButtonUi postId={id} commentId={comment.id} />
                  )}
                  <Cardi.Header>{comment.username}</Cardi.Header>
                  <Cardi.Meta>{moment(comment.createdAt).fromNow()}</Cardi.Meta>
                  <Cardi.Description>{comment.body}</Cardi.Description>
                </Cardi.Content>
              </Cardi>
            ))}
          
        
      </Grid>
      </Fade>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      title
      body
      createdAt
      username
      likeCount
      imagePost
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

export default SinglePost;
