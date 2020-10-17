import './DisplayAnsweredQuestions.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionItem from './QuestionItem';
import AskQuestion from './AskQuestion';
import RightSideBox from '../RightSideBox/RightSideBox';


const DisplayAnsweredQuestions = ({ logout }) => {
  const { username } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isFollowed, setIsFollowed] = useState(true);
  const [renderButton, setRenderButton] = useState(false);
  const [page, setPage] = useState(1);
  const [questionsCount, setQuestionsCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchProfile() {
    if (questions.length >= questionsCount) {
      setHasMore(false);
      return;
    }

    try {
      const response = await axiosInstance.get(`/user/${username}`, {
        params: {
          page,
          limit: 5
        }
      });

      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setQuestionsCount(response.data.questionsCount);
      setIsFollowed(response.data.isFollowed);
      setRenderButton(response.data.renderFollowButton);
      setPage((prevState) => prevState + 1);
    } catch (e) {
      if (e.response.status === 401) return logout();

      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    setPage(1);
    setQuestionsCount(1);
    setQuestions([]);
    setHasMore(true);
    fetchProfile();
  }, [username]);

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
  return (
    <div className="FlexParent">
      <div className="leftFlexChild">
        <AskQuestion
          username={username}
          isFollowed={isFollowed}
          renderButton={renderButton}
        />
        <InfiniteScroll
          dataLength={questions.length}
          next={fetchProfile}
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

export default DisplayAnsweredQuestions;
