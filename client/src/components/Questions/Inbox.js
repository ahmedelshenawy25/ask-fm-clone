import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionItem from './QuestionItem';
import RightSideBox from '../RightSideBox/RightSideBox';


const Inbox = ({ logout }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInbox() {
      try {
        const response = await axiosInstance.get('/account/inbox');
        setQuestions(response.data);
      } catch (e) {
        if (e.response.status === 401) return logout();

        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchInbox();
  }, []);

  const removeQuestion = (id) => {
    const filteredQuestions = questions.filter((question) => question._id !== id);
    setQuestions(filteredQuestions);
  };

  const renderedQuestions = questions.map(({
    _id, question, answer, sender, createdAt
  }) => (
    <QuestionItem
      key={_id}
      id={_id}
      question={question}
      answer={answer}
      sender={sender}
      time={new Date(createdAt).toLocaleString()}
      isAnswered={false}
      removeQuestion={removeQuestion}
    />
  ));
  return (
    <div className="FlexParent">
      <div className="leftFlexChild">
        {renderedQuestions}
      </div>
      <RightSideBox />
    </div>
  );
};

Inbox.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Inbox;
