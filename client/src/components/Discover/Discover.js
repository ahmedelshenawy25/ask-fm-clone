import React, { useState, useEffect } from 'react';
import UserItem from '../User/UserItem';
import axiosInstance from '../../axiosInstance/axiosInstance';
import Follow from '../Follow/Follow';

const Discover = () => {
  const [discoveredUsers, setDiscoveredUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDiscoverUsers() {
      try {
        const response = await axiosInstance.get('/discover');
        setDiscoveredUsers(response.data);
      } catch (e) {
        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchDiscoverUsers();
  }, []);

  return (
    <div className="right section">
      {discoveredUsers.map(({
        _id, username, firstName, lastName
      }) => (
        <div key={_id}>
          <UserItem
            key={`${_id}${username}`}
            username={username}
            fullName={`${firstName} ${lastName}`}
          />
          <Follow isFollowed={false} username={username} />
        </div>
      ))}
    </div>
  );
};

export default Discover;
