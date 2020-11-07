import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  card: {
    Width: '100%',
    height:'500px',
    margin: theme.spacing(2),
  },
  media: {
    height: 190,
  },
}));

 export default function SkeletonPost(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
        title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
      subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      {<Skeleton animation="wave" variant="rect" className={classes.media} />}

     
    </Card>
  );
}

