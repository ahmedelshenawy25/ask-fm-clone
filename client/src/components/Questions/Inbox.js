import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosInstance/axiosInstance';
import UnansweredQuestion from './UnansweredQuestion';
import RightSideBox from '../RightSideBox/RightSideBox';

const Inbox = ({ logout }) => {
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
          limit: 5
        }
      });

      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setPage(pageNum + 1);

      if (response.data.questionsCount === questions.length + response.data.questions.length) {
        setHasMore(false);
      }
    } catch (e) {
      if (e.response.status === 401) return logout();

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
    <div>
      <div>
        <InfiniteScroll
          dataLength={questions.length}
          next={() => fetchInbox({ pageNum: page })}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<h2>Loading...</h2>}
          endMessage={<p><strong>No more content</strong></p>}
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
      </div>
      <RightSideBox />
    </div>
  );
};

Inbox.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Inbox;
