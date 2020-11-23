import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionLayout from './QuestionLayout/QuestionLayout';

const UnansweredQuestion = ({
  id, removeQuestion, question, sender, time
}) => {
  const [error, setError] = useState('');

  const questionDeleteHandler = async () => {
    removeQuestion(id);
    try {
      await axiosInstance.delete(`/delete/${id}`);
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  const answerErrorHandler = (e) => {
    setError(e.response ? e.response.data.message : e.message);
  };

  return (
    <QuestionLayout
      question={question}
      time={time}
      sender={sender}
      id={id}
      removeQuestion={removeQuestion}
      questionDeleteHandler={questionDeleteHandler}
      answerErrorHandler={answerErrorHandler}
    />
  );
};

UnansweredQuestion.propTypes = {
  id: PropTypes.string.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  sender: PropTypes.object,
  time: PropTypes.string.isRequired
};

export default UnansweredQuestion;
