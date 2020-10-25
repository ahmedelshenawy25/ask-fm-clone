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

  const renderedFriends = friends.map(({
    followedUser
  }) => (
    <UserItem
      key={`${followedUser._id}${followedUser.username}`}
      username={followedUser.username}
      fullName={`${followedUser.firstName} ${followedUser.lastName}`}
    />
  ));
  return (
    <div className="right section">
      {renderedFriends}
    </div>
  );
};

export default Friends;
