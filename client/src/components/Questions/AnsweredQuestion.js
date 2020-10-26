import React from 'react';
import PropTypes from 'prop-types';
import QuestionLayout from './QuestionLayout';

const AnsweredQuestion = ({
  question, answer, sender, time
}) => (
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
          <p style={{ fontSize: '1.2rem', lineHeight: '1.5rem' }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  </div>
);

AnsweredQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  sender: PropTypes.object,
  time: PropTypes.string.isRequired
};

export default AnsweredQuestion;
