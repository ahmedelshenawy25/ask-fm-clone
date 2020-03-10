import './DisplayAnsweredQuestions.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionItem from './QuestionItem';
import AskQuestion from './AskQuestion';
import RightSideBox from '../RightSideBox/RightSideBox';


const DisplayAnsweredQuestions = ({ logout }) => {
  const { username } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isFollowed, setIsFollowed] = useState(true);
  const [renderButton, setRenderButton] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axiosInstance.get(`/user/${username}`);
        setQuestions(response.data.modifiedQuestions);
        setIsFollowed(response.data.isFollowed);
        setRenderButton(response.data.renderFollowButton);
      } catch (e) {
        if (e.response.status === 401) return logout();

        setError(e.response ? e.response.data.message : e.message);
      }
    }

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
        {renderedQuestions}
      </div>
      <RightSideBox />
    </div>
  );
};

DisplayAnsweredQuestions.propTypes = {
  logout: PropTypes.func.isRequired
};
export default DisplayAnsweredQuestions;
