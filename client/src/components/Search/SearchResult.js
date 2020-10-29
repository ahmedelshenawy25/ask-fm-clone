import './SearchResult.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../../axiosInstance/axiosInstance';
import UserItem from '../User/UserItem';

const SearchResult = ({ logout }) => {
  const { search } = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsCount, setSearchResultsCount] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  async function fetchSearchResult() {
    if (searchResults.length >= searchResultsCount) {
      setHasMore(false);
      return;
    }

    try {
      const response = await axiosInstance.get(`/search${search}`, {
        params: {
          page,
          limit: 30
        }
      });

      setHasMore(true);
      setSearchResults((prevState) => [...prevState, ...response.data.users]);
      setSearchResultsCount(response.data.usersCount);
      setPage((prevState) => prevState + 1);

      if (response.data.usersCount === 0 || response.data.usersCount === response.data.users) {
        setHasMore(false);
      }
    } catch (e) {
      if (e.response.status === 401) return logout();

      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    setPage(1);
    setSearchResultsCount(1);
    setSearchResults([]);
    setHasMore(true);
    fetchSearchResult();
  }, [search]);

  return (
    <div>
      <div className="ui info message">
        {`"${searchResultsCount}" search results for "${search.replace('?q=', '')}"`}
      </div>
      <InfiniteScroll
        dataLength={searchResults.length}
        next={fetchSearchResult}
        hasMore={hasMore}
        scrollThreshold={1}
        loader={<h2 style={{ textAlign: 'center' }}>Loading...</h2>}
      >
        <div className="ui relaxed divided list results">
          {searchResults.map(({ _id, username, fullName }) => (
            <UserItem
              key={_id}
              username={username}
              fullName={fullName}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

SearchResult.propTypes = {
  logout: PropTypes.func.isRequired
};

export default SearchResult;
