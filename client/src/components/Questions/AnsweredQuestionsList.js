import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import QuestionLayout from './QuestionLayout/QuestionLayout';
import Sidebar from '../Sidebar/Sidebar';
import AskForm from '../Ask/AskForm';
import useFetch from '../../hooks/useFetch';
import fetchAnsweredQuestions from '../../axiosInstance/fetchAnsweredQuestions';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';

const useStyles = makeStyles({
  loading: {
    display: 'block',
    margin: 'auto'
  }
});

const AnsweredQuestionsList = ({ logout }) => {
  const classes = useStyles();
  const { username } = useParams();
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    data: questions, isLoading, hasMore, isFollowed, error
  } = useFetch({
    apiCall: fetchAnsweredQuestions,
    page,
    limit: 10,
    urlParam: username
  });
  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

  return (
    <Grid container spacing={2}>
      <Grid item sm={7} xs={12}>
        <AskForm
          username={username}
          isFollowed={isFollowed}
        />
        {questions.map(({
          _id, question, answer, sender, updatedAt
        }, i) => (
          <InfiniteScroll
            key={_id}
            isLastElement={questions.length === i + 1}
            ref={infiniteScrollingRef}
          >
            <QuestionLayout
              question={question}
              answer={answer}
              sender={sender}
              time={new Date(updatedAt).toLocaleString()}
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

AnsweredQuestionsList.propTypes = {
  logout: PropTypes.func.isRequired
};

export default AnsweredQuestionsList;
