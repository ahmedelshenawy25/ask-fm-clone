import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import UnansweredQuestion from './UnansweredQuestion';
import Sidebar from '../Sidebar/Sidebar';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useFetch from '../../hooks/useFetch';
import fetchUnansweredQuestions from '../../axiosInstance/fetchUnansweredQuestions';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';

const useStyles = makeStyles({
  loading: {
    display: 'block',
    margin: 'auto'
  }
});

const Inbox = ({ logout }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    data: questions, isLoading, hasMore, error
  } = useFetch({
    apiCall: fetchUnansweredQuestions,
    page,
    limit: 10
  });
  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

  const removeQuestion = (id) => {
    const filteredQuestions = questions.filter((question) => question._id !== id);
    // setQuestions(filteredQuestions);
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={7} xs={12}>
        {questions.map(({
          _id, question, sender, createdAt
        }, i) => (
          <InfiniteScroll
            key={_id}
            isLastElement={questions.length === i + 1}
            ref={infiniteScrollingRef}
          >
            <UnansweredQuestion
              id={_id}
              question={question}
              sender={sender}
              time={new Date(createdAt).toLocaleString()}
              removeQuestion={removeQuestion}
            />
          </InfiniteScroll>
        ))}
        <div>{isLoading && <CircularProgress className={classes.loading} />}</div>
      </Grid>
      <Hidden xsDown>
        <Grid item sm={4}>
          <Sidebar />
        </Grid>
      </Hidden>
    </Grid>
  );
};

Inbox.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Inbox;
