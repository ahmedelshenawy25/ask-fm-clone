import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useFetch from '../../hooks/useFetch';
import fetchFriends from '../../axiosInstance/fetchFriends';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    paddingBottom: 7
  },
  padding: {
    padding: '15px 20px'
  },
  avatar: {
    width: 35,
    height: 35,
    marginRight: 15
  },
  fullname: {
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 1
  },
  username: {
    color: theme.palette.text.secondary,
    fontSize: 12
  },
  contentSidebar: {
    flexGrow: 1,
    lineHeight: 1,
    maxWidth: 140,
    wordWrap: 'break-word'
  },
  content: {
    flexGrow: 1,
    lineHeight: 1,
    wordWrap: 'break-word'
  },
  paper: {
    marginBottom: 20
  },
  loading: {
    display: 'block',
    margin: 'auto'
  }
}));

const Friends = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const isSidebar = pathname !== '/friends';
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    data: users, isLoading, hasMore, error
  } = useFetch({
    apiCall: fetchFriends,
    page,
    limit: isSidebar ? 5 : 30
  });
  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

  return (
    <Paper className={classes.paper} variant="outlined">
      <div className={classes.padding}>
        <Typography variant="h6">
          Friends
        </Typography>
        {users.map(({
          followedUser: {
            _id, username, firstName, lastName
          }
        }, i) => ((!isSidebar && users.length === i + 1) ? (
          <div className={classes.flex} key={_id} ref={infiniteScrollingRef}>
            <Avatar className={classes.avatar}>
              {`${firstName[0]}${lastName[0]}`.toUpperCase()}
            </Avatar>
            <div className={isSidebar ? classes.contentSidebar : classes.content}>
              <Link className={classes.sender} component={RouterLink} to={`/user/${username}`} underline="none">
                <Typography className={classes.fullname}>
                  {`${firstName} ${lastName}`}
                </Typography>
                <Typography className={classes.username}>
                  {`@${username}`}
                </Typography>
              </Link>
            </div>
          </div>
        ) : (
          <div className={classes.flex} key={_id}>
            <Avatar className={classes.avatar}>
              {`${firstName[0]}${lastName[0]}`.toUpperCase()}
            </Avatar>
            <div className={isSidebar ? classes.contentSidebar : classes.content}>
              <Link className={classes.sender} component={RouterLink} to={`/user/${username}`} underline="none">
                <Typography className={classes.fullname}>
                  {`${firstName} ${lastName}`}
                </Typography>
                <Typography className={classes.username}>
                  {`@${username}`}
                </Typography>
              </Link>
            </div>
          </div>
        )))}
        {isSidebar && (
          <Link className={classes.sender} component={RouterLink} to="/friends">
            See all friends...
          </Link>
        )}
        <div>{isLoading && <CircularProgress className={classes.loading} />}</div>
      </div>
    </Paper>
  );
};

export default Friends;
