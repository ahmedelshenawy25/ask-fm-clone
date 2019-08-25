import React from 'react';
import axios from 'axios';

class Follow extends React.Component {
  state = {
    isFollowed: this.props.isFollowed,
    error: ''
  }

  followHandler = async () => {
    try {
      if (!this.state.isFollowed) {
        const response = await axios.post(`/api/follow/${this.props.username}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
        if (response.status !== 201) {
          throw new Error('Could not follow user');
        }
      } else {
        const response = await axios.delete(`/api/unfollow/${this.props.username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status !== 204) {
          throw new Error('Could not unfollow user');
        }
      }
      this.setState(prevState => ({
        isFollowed: !prevState.isFollowed
      }));
    } catch (e) {
      this.setState({
        error: e.response ? e.response.data.message : e.message
      });
    }
  }

  render() {
    return (
      <div
        className="ui right floated button follow"
        onClick={this.followHandler}
      >
        {this.state.isFollowed ? 'Unfollow' : 'Follow'}
      </div>
    );
  }
}

export default Follow;
