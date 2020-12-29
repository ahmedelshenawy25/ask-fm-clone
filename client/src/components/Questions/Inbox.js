import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Sidebar from '../Sidebar/Sidebar';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useFetch from '../../hooks/useFetch';
import fetchUnansweredQuestions from '../../axiosInstance/fetchUnansweredQuestions';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import QuestionLayout from './QuestionLayout/QuestionLayout';
import deleteQuestion from '../../axiosInstance/deleteQuestion';
import answerQuestion from '../../axiosInstance/answerQuestion';
import Spinner from '../Spinner/Spinner';

const Inbox = ({ logout }) => {
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    data: questions, isLoading, hasMore, error, dispatch
  } = useFetch({
    apiCall: fetchUnansweredQuestions,
    page,
    limit: 10
  });
  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

  const questionDeleteHandler = async (id) => {
    await deleteQuestion({ dispatch, id });
  };

  const answerHandler = async (id, answer) => {
    await answerQuestion({ dispatch, id, answer });
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
            <QuestionLayout
              id={_id}
              question={question}
              time={new Date(createdAt).toLocaleString()}
              sender={sender}
              answerHandler={answerHandler}
              questionDeleteHandler={questionDeleteHandler}
            />
          </InfiniteScroll>
        ))}
        <Spinner isLoading={isLoading} />
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
