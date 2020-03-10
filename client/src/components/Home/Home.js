import './Home.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionItem from '../Questions/QuestionItem';
import SearchItem from '../Search/SearchItem';
import RightSideBox from '../RightSideBox/RightSideBox';


const Home = ({ logout }) => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHomePage() {
      try {
        const response = await axiosInstance.get('/home');
        setQuestions(response.data);
      } catch (e) {
        if (e.response.status === 401) return logout();

        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchHomePage();
  }, [location]);

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
      <RightSideBox />
    </div>
  );
};

Home.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Home;
