import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../Sidebar/Sidebar';
import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionLayout from '../Questions/QuestionLayout/QuestionLayout';

const useStyles = makeStyles({
  loading: {
    display: 'block',
    margin: 'auto'
  }
});

const Home = ({ logout }) => {
  const classes = useStyles();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchHomePage({ pageNum }) {
    try {
      const response = await axiosInstance.get('/home', {
        params: {
          page: pageNum,
          limit: 25
        }
      });

      setHasMore(true);
      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setPage(pageNum + 1);

      if (response.data.questionsCount === questions.length + response.data.questions.length) {
        setHasMore(false);
      }
    } catch (e) {
      if (e.response && e.response.status === 401) return logout();

      setHasMore(false);
      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    fetchHomePage({ pageNum: 1 });

    return () => {
      setQuestions([]);
      setHasMore(true);
    };
  }, [location.key]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={7} xs={12}>
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={questions.length}
          next={() => fetchHomePage({ pageNum: page })}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<CircularProgress className={classes.loading} />}
        >
          {questions.map(({
            _id, question, answer, sender, recipient, updatedAt
          }) => (
            <QuestionLayout
              key={_id}
              question={question}
              answer={answer}
              sender={sender}
              recipient={recipient}
              time={updatedAt}
            />
          ))}
        </InfiniteScroll>
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
