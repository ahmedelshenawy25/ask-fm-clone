import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const QuestionLayout = ({ question, time, sender }) => (
  <div>
    <div>
      {question}
    </div>
    <div>
      <span>
        Sent by:
      </span>

      {sender ? (
        <NavLink to={`/user/${sender.username}`}>
          {`${sender.firstName} ${sender.lastName}`}
        </NavLink>
      ) : 'Anonymous'}

      <span>
        {time}
      </span>
    </div>
  </div>
);

QuestionLayout.propTypes = {
  question: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  sender: PropTypes.object
};
export default QuestionLayout;
