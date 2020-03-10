import React, { useState, useEffect } from 'react';
import SearchItem from '../Search/SearchItem';

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

  const renderedDiscovery = discoveredUsers.map(({
    _id, username, firstName, lastName
  }) => (
    <SearchItem
      key={`${_id}${username}`}
      username={username}
      fullName={`${firstName} ${lastName}`}
      renderButtons
      isFollowed={false}
    />
  ));

  return <div className="right section">{renderedDiscovery}</div>;
};

export default Discover;
