import './SearchResult.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import SearchItem from './SearchItem';


const SearchResult = ({ logout }) => {
  const { search } = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSearchResult() {
      try {
        const response = await axios.get(`/api/search${search}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSearchResults(response.data);
      } catch (e) {
        if (e.response.status === 401) return logout();

        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchSearchResult();
  }, [search]);

  const renderedSearchResults = searchResults.map(({
    _id, username, fullName, isFollowed
  }) => (
    <SearchItem
      key={_id}
      username={username}
      fullName={fullName}
      isFollowed={isFollowed}
      renderButtons
    />
  ));
  return (
    <div>
      <div className="ui info message">
        {`"${searchResults.length}" search results for "${search.replace('?q=', '')}"`}
      </div>
      <div className="ui relaxed divided list results">
        {renderedSearchResults}
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  logout: PropTypes.func.isRequired
};

export default SearchResult;
