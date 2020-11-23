import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../axiosInstance/axiosInstance';
import UnansweredQuestion from './UnansweredQuestion';
import Sidebar from '../Sidebar/Sidebar';

const useStyles = makeStyles({
  loading: {
    display: 'block',
    margin: 'auto'
  }
});

const Inbox = ({ logout }) => {
  const classes = useStyles();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchInbox({ pageNum }) {
    try {
      const response = await axiosInstance.get('/account/inbox', {
        params: {
          page: pageNum,
          limit: 25
        }
      });

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
    fetchInbox({ pageNum: 1 });

    return () => {
      setQuestions([]);
      setHasMore(true);
    };
  }, [location.key]);

  const removeQuestion = (id) => {
    const filteredQuestions = questions.filter((question) => question._id !== id);
    setQuestions(filteredQuestions);
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={7} xs={12}>
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={questions.length}
          next={() => fetchInbox({ pageNum: page })}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<CircularProgress className={classes.loading} />}
        >
          {questions.map(({
            _id, question, sender, createdAt
          }) => (
            <UnansweredQuestion
              key={_id}
              id={_id}
              question={question}
              sender={sender}
              time={new Date(createdAt).toLocaleString()}
              removeQuestion={removeQuestion}
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

Inbox.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Inbox;
