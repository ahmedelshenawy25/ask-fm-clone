import './SearchResult.css';
import React from 'react';
import axios from 'axios';
import SearchItem from './SearchItem';

class SearchResult extends React.Component {
  state = {
    searchResult: [],
    error: ''
  };

  async componentDidMount() {
    try {
      const response = await axios.get('/api/search',
        {
          params: {
            search: this.props.search
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      if (response.status === 200) {
        this.setState({
          searchResult: response.data,
          error: ''
        });
      } else {
        throw new Error('Search for user failed');
      }
    } catch (e) {
      if (e.response.status === 401) {
        this.props.logout();
      }
      this.setState({
        error: e.response ? e.response.data.message : e.message
      });
    }
  }

  render() {
    const renderedSearchResults = this.state.searchResult.map(({
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
          {`"${this.state.searchResult.length}" search results for "${this.props.search}"`}
        </div>
        <div className="ui relaxed divided list results">
          { renderedSearchResults }
        </div>
      </div>
    );
  }
}

export default SearchResult;
