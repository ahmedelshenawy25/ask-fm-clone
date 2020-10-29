import React, { useState, useEffect } from 'react';
import UserItem from '../User/UserItem';
import axiosInstance from '../../axiosInstance/axiosInstance';

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
        <UserItem
          key={`${_id}${username}`}
          username={username}
          fullName={`${firstName} ${lastName}`}
        />
      ))}
    </div>
  );
};

export default Discover;
