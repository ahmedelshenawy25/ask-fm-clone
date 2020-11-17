import React from 'react';
import PropTypes from 'prop-types';
import QuestionLayout from './QuestionLayout';

const AnsweredQuestion = ({
  question, answer, sender, time
}) => (
  <div>
    <div>
      <div>
        <QuestionLayout
          question={question}
          time={time}
          sender={sender}
        />
        <div>
          <p>
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
