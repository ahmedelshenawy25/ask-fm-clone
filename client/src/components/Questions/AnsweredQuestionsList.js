import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionLayout from './QuestionLayout/QuestionLayout';
import Sidebar from '../Sidebar/Sidebar';
import AskForm from '../Ask/AskForm';

const useStyles = makeStyles({
  loading: {
    display: 'block',
    margin: 'auto'
  }
});

const AnsweredQuestionsList = ({ logout }) => {
  const classes = useStyles();
  const { username } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isFollowed, setIsFollowed] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchProfile({ pageNum }) {
    try {
      const response = await axiosInstance.get(`/user/${username}`, {
        params: {
          page: pageNum,
          limit: 25
        }
      });

      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setIsFollowed(response.data.isFollowed);
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
    fetchProfile({ pageNum: 1 });

    return () => {
      setQuestions([]);
      setIsFollowed(true);
      setHasMore(true);
    };
  }, [username]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={7} xs={12}>
        <AskForm
          username={username}
          isFollowed={isFollowed}
        />
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={questions.length}
          next={() => fetchProfile({ pageNum: page })}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<CircularProgress className={classes.loading} />}
        >
          {questions.map(({
            _id, question, answer, sender, updatedAt
          }) => (
            <QuestionLayout
              key={_id}
              question={question}
              answer={answer}
              sender={sender}
              time={new Date(updatedAt).toLocaleString()}
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

AnsweredQuestionsList.propTypes = {
  logout: PropTypes.func.isRequired
};

export default AnsweredQuestionsList;
