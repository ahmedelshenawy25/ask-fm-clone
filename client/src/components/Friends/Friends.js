import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SearchItem from '../Search/SearchItem';


const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await axios.get('/api/friends', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFriends(response.data);
      } catch (e) {
        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchFriends();
  }, []);

  const renderedFriends = friends.map(({
    followedUser
  }) => (
    <SearchItem
      key={`${followedUser._id}${followedUser.username}`}
      username={followedUser.username}
      fullName={`${followedUser.firstName} ${followedUser.lastName}`}
      renderButtons
      isFollowed
    />
  ));
  return (
    <div className="right section">
      {renderedFriends}
    </div>
  );
};

export default Friends;
