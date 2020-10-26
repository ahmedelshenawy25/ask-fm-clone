import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionLayout from './QuestionLayout';
import AnswerForm from '../Answer/AnswerForm';

const QuestionItem = ({
  id, removeQuestion, question, answer, sender, time, isAnswered
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
          <QuestionLayout question={question} time={time} sender={sender} />
          <div style={{ padding: '0' }} className="ui vertical segment" />
          <div className="description">
            {isAnswered ? (
              <p
                style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.5rem'
                }}
              >
                {answer}
              </p>
            )
              : (
                <AnswerForm
                  id={id}
                  removeQuestion={removeQuestion}
                  questionDeleteHandler={questionDeleteHandler}
                  answerErrorHandler={answerErrorHandler}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

QuestionItem.propTypes = {
  id: PropTypes.string,
  removeQuestion: PropTypes.func,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string,
  sender: PropTypes.object,
  time: PropTypes.string.isRequired,
  isAnswered: PropTypes.bool.isRequired
};

export default QuestionItem;
