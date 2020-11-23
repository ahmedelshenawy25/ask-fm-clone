import React, { useState, useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import axiosInstance from '../../axiosInstance/axiosInstance';
import Follow from '../Follow/Follow';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    paddingTop: 20
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
  content: {
    flexGrow: 1,
    lineHeight: 1,
    wordWrap: 'break-word'
  },
  loading: {
    display: 'block',
    margin: 'auto'
  }
}));
const SearchResult = ({ logout }) => {
  const classes = useStyles();
  const { search } = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsCount, setSearchResultsCount] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchSearchResult({ searchQuery, pageNum }) {
    try {
      const response = await axiosInstance.get(`/search${searchQuery}`, {
        params: {
          page: pageNum || page,
          limit: 30
        }
      });

      setHasMore(true);
      setSearchResults((prevState) => [...prevState, ...response.data.users]);
      setSearchResultsCount(response.data.usersCount);
      setPage(pageNum + 1);

      if (response.data.usersCount === searchResults.length + response.data.users.length) {
        setHasMore(false);
      }
    } catch (e) {
      if (e.response && e.response.status === 401) return logout();

      setHasMore(false);
      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    fetchSearchResult({ searchQuery: search, pageNum: 1 });

    return () => {
      setSearchResultsCount(1);
      setSearchResults([]);
      setHasMore(true);
    };
  }, [search]);

  return (
    <Paper className={classes.padding} variant="outlined">
      <Typography>
        {`"${searchResultsCount}" search results for "${search.replace('?q=', '')}"`}
      </Typography>
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={searchResults.length}
        next={() => fetchSearchResult({ searchQuery: search, pageNum: page })}
        hasMore={hasMore}
        scrollThreshold={1}
        loader={<CircularProgress className={classes.loading} />}
      >
        {searchResults.map(({
          _id, username, fullName, isFollowed
        }) => (
          <div className={classes.flex} key={_id}>
            <Avatar className={classes.avatar} />
            <div className={classes.content}>
              <Link component={RouterLink} to={`/user/${username}`} underline="none">
                <Typography className={classes.fullname}>
                  {`${fullName}`}
                </Typography>
                <Typography className={classes.username}>
                  {`@${username}`}
                </Typography>
              </Link>
            </div>
            <Follow isFollowed={isFollowed} username={username} />
          </div>
        ))}
      </InfiniteScroll>
    </Paper>
  );
};

SearchResult.propTypes = {
  logout: PropTypes.func.isRequired
};

export default SearchResult;
