import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
 media: {
    height: 450,
    width: 340,
  },
  img:{
    height: '30vh',
    marginTop:'70px'
  }
}));

 export default function SkeletonPost() {
  const classes = useStyles();

  return (
    <Card className={classes.media}>
      <CardHeader
        avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
        title={<Skeleton animation="wave" height={10} width="50%" style={{ marginBottom: 6 }} />}
      subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      
      <Skeleton animation="wave" variant="rect"  className={classes.img} />

     
    </Card>
  );
}
