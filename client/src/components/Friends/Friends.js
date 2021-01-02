import React, { useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useFetchFriends from '../../hooks/api/useFetchFriends';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import User from '../User/User';
import Spinner from '../Spinner/Spinner';
import ErrorContext from '../../context/ErrorContext';

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
  }
});

const Friends = () => {
  const classes = useStyles();
  const errorHandler = useContext(ErrorContext);
  const { pathname } = useLocation();
  const isSidebar = pathname !== '/friends';
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    users, isLoading, hasMore, error
  } = useFetchFriends({
    page,
    limit: isSidebar ? 5 : 30
  });

  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

  useEffect(() => {
    if (error) {
      errorHandler(error);
    }
  }, [error]);

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
        <Spinner isLoading={isLoading} />
        {isSidebar && (
          <Link component={RouterLink} to="/friends">
            See all friends...
          </Link>
        )}
      </div>
    </Paper>
  );
};

export default Friends;
