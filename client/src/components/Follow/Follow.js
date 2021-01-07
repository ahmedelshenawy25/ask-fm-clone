import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import axiosInstance from '../../axiosInstance/axiosInstance';
import ErrorContext from '../../context/ErrorContext';

const Follow = ({ isFollowed: isUserFollowed, username }) => {
  const [isFollowed, setIsFollowed] = useState(isUserFollowed);
  const errorHandler = useContext(ErrorContext);

  const followHandler = async () => {
    try {
      if (isFollowed) {
        await axiosInstance.delete(`/users/${username}/follow`);
      } else {
        await axiosInstance.post(`/users/${username}/follow`);
      }
      setIsFollowed((prevState) => !prevState);
    } catch (e) {
      const error = e.response ? e.response.data.message : e.message;
      errorHandler(error);
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
