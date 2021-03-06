import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Sidebar from '../Sidebar/Sidebar';
import QuestionLayout from '../Questions/QuestionLayout/QuestionLayout';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useFetchFriendsQuestions from '../../hooks/api/useFetchFriendsQuestions';
// import fetchFriendsQuestions from '../../axiosInstance/fetchFriendsQuestions';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import Spinner from '../Spinner/Spinner';
import ErrorContext from '../../context/ErrorContext';

const Home = () => {
  const errorHandler = useContext(ErrorContext);
  const [page, setPage] = useState(1);
  const updatePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const {
    questions, isLoading, hasMore, error
  } = useFetchFriendsQuestions({
    page,
    limit: 10
  });
  const infiniteScrollingRef = useInfiniteScrolling(isLoading, hasMore, updatePage);

  useEffect(() => {
    if (error) {
      errorHandler(error);
    }
  }, [error]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={7} xs={12}>
        {questions.map(({
          _id, question, answer, sender, recipient, updatedAt
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
              recipient={recipient}
              time={updatedAt}
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

export default Home;
