import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../Sidebar/Sidebar';
import QuestionLayout from '../Questions/QuestionLayout/QuestionLayout';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useFetch from '../../hooks/useFetch';
import fetchFriendsQuestions from '../../axiosInstance/fetchFriendsQuestions';

const useStyles = makeStyles({
  loading: {
    display: 'block',
    margin: 'auto'
  }
});

const Home = ({ logout }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    data: questions, isLoading, hasMore, error
  } = useFetch({
    apiCall: fetchFriendsQuestions,
    page,
    limit: 10
  });
  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

  return (
    <Grid container spacing={2}>
      <Grid item sm={7} xs={12}>
        {questions.map(({
          _id, question, answer, sender, recipient, updatedAt
        }, i) => ((questions.length === i + 1) ? (
          <div key={_id} ref={infiniteScrollingRef}>
            <QuestionLayout
              question={question}
              answer={answer}
              sender={sender}
              recipient={recipient}
              time={updatedAt}
            />
          </div>
        ) : (
          <div key={_id}>
            <QuestionLayout
              question={question}
              answer={answer}
              sender={sender}
              recipient={recipient}
              time={updatedAt}
            />
          </div>
        )))}
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

Home.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Home;
