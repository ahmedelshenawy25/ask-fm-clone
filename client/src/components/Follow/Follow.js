/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


const Follow = ({ isFollowed: isUserFollowed, username }) => {
  const [isFollowed, setIsFollowed] = useState(isUserFollowed);
  const [error, setError] = useState('');

  const followHandler = async () => {
    try {
      if (!isFollowed) {
        await axios.post(`/api/follow/${username}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
      } else {
        await axios.delete(`/api/unfollow/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      setIsFollowed((prevState) => !prevState);
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  return (
    <div className="ui right floated button follow" onClick={followHandler}>
      {isFollowed ? 'Unfollow' : 'Follow'}
    </div>
  );
};

Follow.propTypes = {
  username: PropTypes.string.isRequired,
  isFollowed: PropTypes.bool.isRequired
};

export default Follow;
