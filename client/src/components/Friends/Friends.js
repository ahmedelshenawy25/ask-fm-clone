import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useFetch from '../../hooks/useFetch';
import fetchFriends from '../../axiosInstance/fetchFriends';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import User from '../User/User';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    paddingBottom: 7
  },
  padding: {
    padding: '15px 20px'
  },
  paper: {
    marginBottom: 20
  },
  loading: {
    display: 'block',
    margin: 'auto'
  }
});

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
        }, i) => (
          <InfiniteScroll
            key={_id}
            isLastElement={!isSidebar && users.length === i + 1}
            ref={infiniteScrollingRef}
          >
            <div className={classes.flex}>
              <User
                fullName={`${firstName} ${lastName}`}
                username={username}
                isSidebar={isSidebar}
              />
            </div>
          </InfiniteScroll>
        ))}
        {isSidebar && (
          <Link component={RouterLink} to="/friends">
            See all friends...
          </Link>
        )}
        <div>{isLoading && <CircularProgress className={classes.loading} />}</div>
      </div>
    </Paper>
  );
};

export default Friends;
