import './DisplayAnsweredQuestions.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import QuestionItem from './QuestionItem';
import AskQuestion from './AskQuestion';
import RightSideBox from '../RightSideBox/RightSideBox';


const DisplayAnsweredQuestions = ({ logout, token }) => {
  const { username } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isFollowed, setIsFollowed] = useState(true);
  const [renderButton, setRenderButton] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get(`/api/user/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setQuestions(response.data.modifiedQuestions);
        setIsFollowed(response.data.isFollowed);
        setRenderButton(response.data.renderFollowButton);
      } catch (e) {
        if (e.response.status === 401) return logout();

        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchProfile();
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
  return (
    <div className="FlexParent">
      <div className="leftFlexChild">
        <AskQuestion
          username={username}
          isFollowed={isFollowed}
          renderButton={renderButton}
        />
        {renderedQuestions}
      </div>
      {token && <RightSideBox />}
    </div>
  );
};

DisplayAnsweredQuestions.propTypes = {
  logout: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired
};
export default DisplayAnsweredQuestions;
