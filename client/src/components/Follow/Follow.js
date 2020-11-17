/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../axiosInstance/axiosInstance';

const Follow = ({ isFollowed: isUserFollowed, username }) => {
  const [isFollowed, setIsFollowed] = useState(isUserFollowed);
  const [error, setError] = useState('');

  const followHandler = async () => {
    try {
      if (isFollowed) {
        await axiosInstance.delete(`/unfollow/${username}`);
      } else {
        await axiosInstance.post(`/follow/${username}`);
      }
      setIsFollowed((prevState) => !prevState);
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  return (
    <div onClick={followHandler}>
      {isFollowed ? 'Unfollow' : 'Follow'}
    </div>
  );
};

Follow.propTypes = {
  username: PropTypes.string.isRequired,
  isFollowed: PropTypes.bool.isRequired
};

export default Follow;
