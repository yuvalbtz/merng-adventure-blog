import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import DeleteButtonUi from './DeleteButtonUi';
import PlaceIcon from '@material-ui/icons/Place'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { Button,Icon, Label } from 'semantic-ui-react';
import MyPopup from '../util/MyPopup';
import LikeButton from './LikeButton';
import EditButtonUi from './EditButtonUi'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    height:'auto'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  heart:{
     color:"red"
  },
  heartBtn:{
      width:"3px"
  },
  titleText:{
      textOverflow:"elipsis",
      whiteSpace:"nowrap",
      overflow:"hidden"
  }
}));

export default function PostCardUi({post: { imagePost,title,body, createdAt, id, username, likeCount, commentCount, likes }}) {
    
  const {user} = useContext(AuthContext) 
  
  const updatePost = {
      id,
      title,
      imagePost,
      body
    }

  
const classes = useStyles();
  
return (
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
         <PlaceIcon/> {title}
        </Typography>
        </CardContent>
      {imagePost && (<CardMedia
        component={Link} to={`/posts/${id}`}
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
        <MyPopup content="Comment on post">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && <EditButtonUi post={updatePost} />}
        {user && user.username === username && <DeleteButtonUi postId={id} />}
      </CardActions>
     </Card>
  );
}