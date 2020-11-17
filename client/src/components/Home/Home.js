import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosInstance/axiosInstance';
import AnsweredQuestion from '../Questions/AnsweredQuestion';
import UserItem from '../User/UserItem';
import RightSideBox from '../RightSideBox/RightSideBox';

const Home = ({ logout }) => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchHomePage({ pageNum }) {
    try {
      const response = await axiosInstance.get('/home', {
        params: {
          page: pageNum,
          limit: 15
        }
      });

      setHasMore(true);
      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setPage(pageNum + 1);

      if (response.data.questionsCount === questions.length + response.data.questions.length) {
        setHasMore(false);
      }
    } catch (e) {
      if (e.response && e.response.status === 401) return logout();

      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    fetchHomePage({ pageNum: 1 });

    return () => {
      setQuestions([]);
      setHasMore(true);
    };
  }, [location.key]);

  return (
    <div>
      <div>
        <InfiniteScroll
          dataLength={questions.length}
          next={() => fetchHomePage({ pageNum: page })}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<h2>Loading...</h2>}
          endMessage={<p><strong>No more content</strong></p>}
        >
          {questions.map(({
            _id, question, answer, sender, recipient, updatedAt
          }) => (
            <div key={_id}>
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
