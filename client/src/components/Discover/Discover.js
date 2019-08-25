import React from 'react';
import axios from 'axios';
import SearchItem from '../Search/SearchItem';

class Discover extends React.Component {
  state = {
    discoveredUsers: [],
    error: ''
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/api/discover', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status !== 200) {
        throw new Error('Could not discover new users');
      }
      this.setState({
        discoveredUsers: response.data
      });
    } catch (e) {
      this.setState({
        discoveredUsers: [],
        error: e.response ? e.response.data.message : e.message
      });
    }
  }

  render() {
    const renderedDiscovery = this.state.discoveredUsers.map(({
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
    return (
      <div className="right section">
        {renderedDiscovery}
      </div>
    );
  }
}

export default Discover;
