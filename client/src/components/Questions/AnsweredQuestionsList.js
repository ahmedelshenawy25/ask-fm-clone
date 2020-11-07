import './AnsweredQuestionsList.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../../axiosInstance/axiosInstance';
import AnsweredQuestion from './AnsweredQuestion';
import RightSideBox from '../RightSideBox/RightSideBox';
import AskForm from '../Ask/AskForm';

const AnsweredQuestionsList = ({ logout }) => {
  const { username } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isFollowed, setIsFollowed] = useState(true);
  const [renderButton, setRenderButton] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchProfile({ pageNum }) {
    try {
      const response = await axiosInstance.get(`/user/${username}`, {
        params: {
          page: pageNum,
          limit: 5
        }
      });

      setQuestions((prevState) => [...prevState, ...response.data.questions]);
      setIsFollowed(response.data.isFollowed);
      setRenderButton(response.data.renderFollowButton);
      setPage(pageNum + 1);

      if (response.data.questionsCount === questions.length + response.data.questions.length) {
        setHasMore(false);
      }
    } catch (e) {
      if (e.response.status === 401) return logout();

      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    fetchProfile({ pageNum: 1 });

    return () => {
      setQuestions([]);
      setHasMore(true);
    };
  }, [username]);

  return (
    <div className="FlexParent">
      <div className="leftFlexChild">
        <AskForm
          username={username}
          isFollowed={isFollowed}
          renderButton={renderButton}
        />
        <InfiniteScroll
          dataLength={questions.length}
          next={() => fetchProfile({ pageNum: page })}
          hasMore={hasMore}
          scrollThreshold={1}
          loader={<h2 style={{ textAlign: 'center' }}>Loading...</h2>}
          endMessage={<p style={{ textAlign: 'center' }}><strong>No more content</strong></p>}
        >
          {questions.map(({
            _id, question, answer, sender, updatedAt
          }) => (
            <AnsweredQuestion
              key={_id}
              question={question}
              answer={answer}
              sender={sender}
              time={new Date(updatedAt).toLocaleString()}
            />
          ))}
        </InfiniteScroll>
      </div>
      <RightSideBox />
    </div>
  );
};

AnsweredQuestionsList.propTypes = {
  logout: PropTypes.func.isRequired
};

export default AnsweredQuestionsList;
