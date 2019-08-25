import React from 'react';
import axios from 'axios';
import SearchItem from '../Search/SearchItem';

class Friends extends React.Component {
  state = {
    friends: [],
    error: ''
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/api/friends', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status !== 200) {
        throw new Error('Could not find friends');
      }
      this.setState({
        friends: response.data
      });
    } catch (e) {
      this.setState({
        friends: [],
        error: e.response ? e.response.data.message : e.message
      });
    }
  }

  render() {
    const renderedFriends = this.state.friends.map(({
      followedUser
    }) => (
      <SearchItem
        key={`${followedUser._id}${followedUser.username}`}
        username={followedUser.username}
        fullName={`${followedUser.firstName} ${followedUser.lastName}`}
        renderButtons
        isFollowed
      />
    ));
    return (
      <div className="right section">
        {renderedFriends}
      </div>
    );
  }
}

export default Friends;
