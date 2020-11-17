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

  async function fetchSearchResult({ searchQuery, pageNum }) {
    try {
      const response = await axiosInstance.get(`/search${searchQuery}`, {
        params: {
          page: pageNum || page,
          limit: 10
        }
      });

      setHasMore(true);
      setSearchResults((prevState) => [...prevState, ...response.data.users]);
      setSearchResultsCount(response.data.usersCount);
      setPage(pageNum + 1);

      if (response.data.usersCount === searchResults.length + response.data.users.length) {
        setHasMore(false);
      }
    } catch (e) {
      if (e.response && e.response.status === 401) return logout();

      setError(e.response ? e.response.data.message : e.message);
    }
  }

  useEffect(() => {
    fetchSearchResult({ searchQuery: search, pageNum: 1 });

    return () => {
      setSearchResultsCount(1);
      setSearchResults([]);
      setHasMore(true);
    };
  }, [search]);

  return (
    <div>
      <div>
        {`"${searchResultsCount}" search results for "${search.replace('?q=', '')}"`}
      </div>
      <InfiniteScroll
        dataLength={searchResults.length}
        next={() => fetchSearchResult({ searchQuery: search, pageNum: page })}
        hasMore={hasMore}
        scrollThreshold={1}
        loader={<h2>Loading...</h2>}
        endMessage={<p><strong>No more content</strong></p>}
      >
        <div>
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
