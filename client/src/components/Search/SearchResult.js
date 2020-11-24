import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Follow from '../Follow/Follow';
import fetchSearch from '../../axiosInstance/fetchSearch';
import useFetch from '../../hooks/useFetch';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';

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
      {/* <Typography>
        {`"${usersCount}" search results for "${search.replace('?q=', '')}"`}
      </Typography> */}
      {users.map(({
        _id, username, fullName, isFollowed
      }, i) => ((users.length === i + 1) ? (
        <div className={classes.flex} key={_id} ref={infiniteScrollingRef}>
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
      ) : (
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
      )))}
      <div>{isLoading && <CircularProgress className={classes.loading} />}</div>
    </Paper>
  );
};

SearchResult.propTypes = {
  logout: PropTypes.func.isRequired
};

export default SearchResult;
