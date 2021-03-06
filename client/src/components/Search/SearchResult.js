import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Follow from '../Follow/Follow';
import useFetchSearch from '../../hooks/api/useFetchSearch';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import User from '../User/User';
import Spinner from '../Spinner/Spinner';
import ErrorContext from '../../context/ErrorContext';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    paddingTop: 20
  },
  padding: {
    padding: '15px 20px'
  }
});

const SearchResult = () => {
  const classes = useStyles();
  const errorHandler = useContext(ErrorContext);
  const { search } = useLocation();
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    users, isLoading, hasMore, error
  } = useFetchSearch({
    page,
    limit: 10,
    searchQuery: search
  });
  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

  useEffect(() => {
    if (error) {
      errorHandler(error);
    }
  }, [error]);

  return (
    <Paper className={classes.padding} variant="outlined">
      {users.map(({
        _id, username, fullName, isFollowed
      }, i) => (
        <InfiniteScroll
          key={_id}
          isLastElement={users.length === i + 1}
          ref={infiniteScrollingRef}
        >
          <div className={classes.flex}>
            <User
              fullName={fullName}
              username={username}
              isSidebar={false}
            />
            <Follow isFollowed={isFollowed} username={username} />
          </div>
        </InfiniteScroll>
      ))}
      <Spinner isLoading={isLoading} />
    </Paper>
  );
};

export default SearchResult;
