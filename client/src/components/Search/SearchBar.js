import React from 'react';
import { withRouter } from 'react-router-dom';

class SearchBar extends React.Component {
  state = {
    search: ''
  }

  searchHandler = (event) => {
    event.preventDefault();
    this.props.history.push(`/search?q=${this.state.search}`);
    this.setState({
      search: ''
    });
  }

  render() {
    return (
      <form method="GET" onSubmit={this.searchHandler}>
        <div style={{ margin: '0 50%' }} className="ui search">
          <div className="ui icon input">
            <input
              className="prompt"
              name="search"
              type="text"
              placeholder="Search"
              value={this.state.search}
              onChange={e => this.setState({ search: e.target.value })}
            />
            <i className="search icon" />
          </div>
        </div>
      </form>
    );
  }
}

export default withRouter(SearchBar);
