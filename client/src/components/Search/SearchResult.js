import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Follow from '../Follow/Follow';
import fetchSearch from '../../axiosInstance/fetchSearch';
import useFetch from '../../hooks/useFetch';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import User from '../User/User';
import Spinner from '../Spinner/Spinner';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    paddingTop: 20
  },
  padding: {
    padding: '15px 20px'
  }
});

const SearchResult = ({ logout }) => {
  const classes = useStyles();
  const { search } = useLocation();
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    data: users, isLoading, hasMore, error
  } = useFetch({
    apiCall: fetchSearch,
    page,
    limit: 10,
    urlParam: search
  });
  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

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

SearchResult.propTypes = {
  logout: PropTypes.func.isRequired
};

export default SearchResult;
