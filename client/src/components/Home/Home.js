import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Sidebar from '../Sidebar/Sidebar';
import QuestionLayout from '../Questions/QuestionLayout/QuestionLayout';
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling';
import useFetch from '../../hooks/useFetch';
import fetchFriendsQuestions from '../../axiosInstance/fetchFriendsQuestions';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import Spinner from '../Spinner/Spinner';

const Home = () => {
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
