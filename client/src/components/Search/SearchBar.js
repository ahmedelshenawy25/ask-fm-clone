import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';


const SearchBar = () => {
  const history = useHistory();
  const [search, setSearch] = useState('');

  const searchHandler = (event) => {
    event.preventDefault();
    history.push(`/search?q=${search}`);
    setSearch('');
  };

  return (
    <form onSubmit={searchHandler}>
      <div style={{ margin: '0 50%' }} className="ui search">
        <div className="ui icon input">
          <input
            className="prompt"
            name="search"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="search icon" />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
