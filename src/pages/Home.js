import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import Fade from '@material-ui/core/Fade';
import SkeletonPost from '../components/SkeletonPost'
/////
import PostCardUi from '../components/PostCardUi'



function Home() {
  const { user } = useContext(AuthContext);
  const {
    loading,
    data,
  } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid container justify="center" spacing={2}>
      
        <h1>Recent Posts</h1>
     
      <Grid item xs={12}>
        {user && (
          <PostForm />
          )}
        {loading ? (
          <SkeletonPost/>
        ) : (
          <Fade in={true}>
             <Grid style={{marginTop:'20px'}} item xs={12}>
        <Grid container  spacing={3}>
        {data &&
              data.getPosts.map((post) => (
            <Grid key={post.id} item>
               <PostCardUi post={post}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
      </Fade>
        )}
      </Grid>
    </Grid>
  );
}

export default Home;
