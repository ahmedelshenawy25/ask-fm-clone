import './QuestionLayout.css';
import React from 'react';
import { NavLink } from 'react-router-dom';

const QuestionLayout = ({ question, time, sender }) => (
  <div>
    <div className="header QuestionLayout">{question}</div>
    <div className="meta">
      <span>Sent by:</span>
      {sender ? (
        <NavLink className="ui item" to={`/user/${sender.username}`}>
          {' '}
          {sender.firstName}
          {' '}
          {sender.lastName}
        </NavLink>
      ) : 'Anonymous'}
      <span className="right floated time">{time}</span>
    </div>
  </div>
);

export default QuestionLayout;
