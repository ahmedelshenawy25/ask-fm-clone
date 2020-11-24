import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
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
    <Button onClick={followHandler}>
      {isFollowed ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

Follow.propTypes = {
  username: PropTypes.string.isRequired,
  isFollowed: PropTypes.bool.isRequired
};

export default Follow;
