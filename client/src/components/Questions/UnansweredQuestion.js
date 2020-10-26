import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionLayout from './QuestionLayout';
import AnswerForm from '../Answer/AnswerForm';

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
    <div className="ui divided items">
      <div style={{ minWidth: '100%' }} className="ui card QuestionItem">
        <div className="content">
          <QuestionLayout
            question={question}
            time={time}
            sender={sender}
          />
          <div style={{ padding: '0' }} className="ui vertical segment" />
          <div className="description">
            <AnswerForm
              id={id}
              removeQuestion={removeQuestion}
              questionDeleteHandler={questionDeleteHandler}
              answerErrorHandler={answerErrorHandler}
            />
          </div>
        </div>
      </div>
    </div>
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
