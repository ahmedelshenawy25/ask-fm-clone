import React, { useState, useEffect } from 'react';
import axiosInstace from '../../axiosInstance/axiosInstance';
import UserItem from '../User/UserItem';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await axiosInstace.get('/friends');
        setFriends(response.data);
      } catch (e) {
        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchFriends();
  }, []);

  return (
    <div className="right section">
      {friends.map(({
        followedUser: {
          _id, username, firstName, lastName
        }
      }) => (
        <UserItem
          key={`${_id}${username}`}
          username={username}
          fullName={`${firstName} ${lastName}`}
        />
      ))}
    </div>
  );
};

export default Friends;
