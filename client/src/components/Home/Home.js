import './Home.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionItem from '../Questions/QuestionItem';
import UserItem from '../User/UserItem';
import RightSideBox from '../RightSideBox/RightSideBox';

const Home = ({ logout }) => {
  const [questions, setQuestions] = useState([]);
  const [questionsCount, setQuestionsCount] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchHomePage() {
    if (questions.length >= questionsCount) {
      setHasMore(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/home', {
        params: {
          page,
          limit: 15
        }
      });

      setHasMore(true);
      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setQuestionsCount(response.data.questionsCount);
      setPage((prevSate) => prevSate + 1);
    } catch (e) {
      if (e.response.status === 401) return logout();

      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    fetchHomePage();
  }, []);

  const renderedQuestions = questions.map(({
    _id, question, answer, sender, updatedAt
  }) => (
    <QuestionItem
      key={_id}
      question={question}
      answer={answer}
      sender={sender}
      time={new Date(updatedAt).toLocaleString()}
      isAnswered
    />
  ));
  const renderedUsers = questions.map(({
    _id, recipient
  }) => (
    <UserItem
      key={`${_id}${recipient.username}`}
      username={recipient.username}
      fullName={`${recipient.firstName} ${recipient.lastName}`}
    />
  ));
  const renderedUsersWithQuestions = renderedUsers.map((user, i) => (
    <div key={i} className="ui card Home">
      {user}
      {renderedQuestions[i]}
    </div>
  ));
  return (
    <div className="FlexParent">
      <div className="ui relaxed divided list questionBox leftFlexChild">
        <InfiniteScroll
          dataLength={questions.length}
          next={fetchHomePage}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<h2 style={{ textAlign: 'center' }}>Loading...</h2>}
          endMessage={<p style={{ textAlign: 'center' }}><strong>No more content</strong></p>}
        >
          {renderedUsersWithQuestions}
        </InfiniteScroll>
      </div>
      <RightSideBox />
    </div>
  );
};

Home.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Home;
