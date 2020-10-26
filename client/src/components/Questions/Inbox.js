import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../../axiosInstance/axiosInstance';
import UnansweredQuestion from './UnansweredQuestion';
import RightSideBox from '../RightSideBox/RightSideBox';


const Inbox = ({ logout }) => {
  const [questions, setQuestions] = useState([]);
  const [questionsCount, setQuestionsCount] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchInbox() {
    if (questions.length >= questionsCount) {
      setHasMore(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/account/inbox', {
        params: {
          page,
          limit: 5
        }
      });

      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setQuestionsCount(response.data.questionsCount);
      setPage((prevState) => prevState + 1);
    } catch (e) {
      if (e.response.status === 401) return logout();

      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    fetchInbox();
  }, []);

  const removeQuestion = (id) => {
    const filteredQuestions = questions.filter((question) => question._id !== id);
    setQuestions(filteredQuestions);
  };

  const renderedQuestions = questions.map(({
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
  ));
  return (
    <div className="FlexParent">
      <div className="leftFlexChild">
        <InfiniteScroll
          dataLength={questions.length}
          next={fetchInbox}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<h2 style={{ textAlign: 'center' }}>Loading...</h2>}
          endMessage={<p style={{ textAlign: 'center' }}><strong>No more content</strong></p>}
        >
          {renderedQuestions}
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
