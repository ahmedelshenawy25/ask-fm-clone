import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchItem from '../Search/SearchItem';

const Discover = () => {
  const [discoveredUsers, setDiscoveredUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDiscoverUsers() {
      try {
        const response = await axios.get('/api/discover', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
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
