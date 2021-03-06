import React, { useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Follow from '../Follow/Follow';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useDiscoverUsers from '../../hooks/api/useDiscoverUsers';
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

const Discover = () => {
  const classes = useStyles();
  const errorHandler = useContext(ErrorContext);
  const { pathname } = useLocation();
  const isSidebar = pathname !== '/discover';
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    users, isLoading, hasMore, error
  } = useDiscoverUsers({
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
          Discover
        </Typography>
        {users.map(({
          _id, username, firstName, lastName
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
              <Follow isFollowed={false} username={username} />
            </div>
          </InfiniteScroll>
        ))}
        <Spinner isLoading={isLoading} />
        {isSidebar && (
          <Link component={RouterLink} to="/discover">
            See all recommendations...
          </Link>
        )}
      </div>
    </Paper>
  );
};

export default Discover;
