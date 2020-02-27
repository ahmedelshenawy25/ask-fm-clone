/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import QuestionLayout from './QuestionLayout';


const QuestionItem = ({
  id, removeQuestion, question, answer: userAnswer, sender, time, isAnswered
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const answerSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/answer/${id}`,
        { answer },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      removeQuestion(id);
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  const questionDeleteHandler = async () => {
    removeQuestion(id);
    try {
      await axios.delete(`/api/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  let displayAnswerOrForm;
  if (isAnswered) {
    displayAnswerOrForm = <p style={{ fontSize: '1.2rem', lineHeight: '1.5rem' }}>{userAnswer}</p>;
  } else {
    displayAnswerOrForm = (
      <form className="ui form">
        <div className="field">
          <textarea
            rows="2"
            className="item"
            name="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div
            style={{ marginTop: '10px' }}
            className={`ui right floated button ${answer.length > 3000 || answer.length === 0
              ? 'disabled' : ''}`}
            onClick={answerSubmitHandler}
          >
            Answer
          </div>
          <div style={{ paddingTop: '17px', paddingRight: '10px' }} className="ui right floated">
            {3000 - answer.length}
          </div>
          <div
            style={{ marginTop: '10px' }}
            className="ui left floated button"
            onClick={questionDeleteHandler}
          >
            Delete
          </div>
        </div>
      </form>
    );
  }
  return (
    <div className="ui divided items">
      <div style={{ minWidth: '100%' }} className="ui card QuestionItem">
        <div className="content">
          <QuestionLayout question={question} time={time} sender={sender} />
          <div style={{ padding: '0' }} className="ui vertical segment" />
          <div className="description">
            {displayAnswerOrForm}
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
