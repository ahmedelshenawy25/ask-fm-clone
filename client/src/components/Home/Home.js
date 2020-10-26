import './Home.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../../axiosInstance/axiosInstance';
import AnsweredQuestion from '../Questions/AnsweredQuestion';
import UserItem from '../User/UserItem';
import RightSideBox from '../RightSideBox/RightSideBox';

const Home = ({ logout }) => {
  const [questions, setQuestions] = useState([]);
  const [questionsCount, setQuestionsCount] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchHomePage() {
    if (questions.length >= questionsCount) {
      setHasMore(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/home', {
        params: {
          page,
          limit: 15
        }
      });

      setHasMore(true);
      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setQuestionsCount(response.data.questionsCount);
      setPage((prevSate) => prevSate + 1);
    } catch (e) {
      if (e.response.status === 401) return logout();

      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    fetchHomePage();
  }, []);

  return (
    <div className="FlexParent">
      <div className="ui relaxed divided list questionBox leftFlexChild">
        <InfiniteScroll
          dataLength={questions.length}
          next={fetchHomePage}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<h2 style={{ textAlign: 'center' }}>Loading...</h2>}
          endMessage={<p style={{ textAlign: 'center' }}><strong>No more content</strong></p>}
        >
          {questions.map(({
            _id, question, answer, sender, recipient, updatedAt
          }) => (
            <div key={_id} className="ui card Home">
              <UserItem
                key={`${_id}${recipient.username}`}
                username={recipient.username}
                fullName={`${recipient.firstName} ${recipient.lastName}`}
              />

              <AnsweredQuestion
                key={_id}
                question={question}
                answer={answer}
                sender={sender}
                time={new Date(updatedAt).toLocaleString()}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
      <RightSideBox />
    </div>
  );
};

Home.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Home;
