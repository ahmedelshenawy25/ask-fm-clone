import './Home.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import QuestionItem from '../Questions/QuestionItem';
import SearchItem from '../Search/SearchItem';
import RightSideBox from '../RightSideBox/RightSideBox';


const Home = ({ logout, token }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHomePage() {
      try {
        const response = await axios.get('/api/home', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setQuestions(response.data);
      } catch (e) {
        if (e.response.status === 401) return logout();

        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchHomePage();
  }, []);

  const renderedQuestions = questions.map(({
    _id, question, answer, sender, updatedAt
  }) => (
    <QuestionItem
      key={_id}
      question={question}
      answer={answer}
      sender={sender}
      time={new Date(updatedAt).toLocaleString()}
      isAnswered
    />
  ));
  const renderedUsers = questions.map(({
    _id, recipient
  }) => (
    <SearchItem
      key={`${_id}${recipient.username}`}
      username={recipient.username}
      fullName={`${recipient.firstName} ${recipient.lastName}`}
      renderButtons={false}
      isFollowed
    />
  ));
  const renderedUsersWithQuestions = renderedUsers.map((user, i) => (
    <div key={i} className="ui card Home">
      {user}
      {renderedQuestions[i]}
    </div>
  ));
  return (
    <div className="FlexParent">
      <div className="ui relaxed divided list questionBox leftFlexChild">
        {renderedUsersWithQuestions}
      </div>
      {token && <RightSideBox />}
    </div>
  );
};

Home.propTypes = {
  logout: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired
};

export default Home;
