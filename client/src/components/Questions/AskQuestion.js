/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Follow from '../Follow/Follow';


const AskQuestion = ({ username, isFollowed, renderButton }) => {
  const [checked, setChecked] = useState(true);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');

  const questionSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`/api/${username}/ask`,
        {
          question,
          isAnonymous: checked
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      setQuestion('');
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  return (
    <div>
      <form className="ui form">
        <div className="field">
          <textarea
            rows="4"
            className="item"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <div className="ui left floated">
            <label htmlFor="anonymous">
              <input
                id="anonymous"
                style={{ marginRight: '5px' }}
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                name="isAnonymous"
              />
              Ask Anonymously
            </label>
            <div style={{ float: 'right', marginRight: '10%' }}>
              {300 - question.length}
            </div>
          </div>
          <div
            style={{ marginTop: '-3.2%', marginBottom: '1%' }}
            className={`ui right floated button 
            ${question.length > 300 || question.length === 0
              ? 'disabled' : ''}`}
            onClick={questionSubmitHandler}
          >
            Ask
          </div>

          {renderButton && (
            <div>
              <Follow
                key={isFollowed}
                username={username}
                isFollowed={isFollowed}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

AskQuestion.propTypes = {
  username: PropTypes.string.isRequired,
  isFollowed: PropTypes.bool.isRequired,
  renderButton: PropTypes.bool.isRequired
};

export default AskQuestion;
