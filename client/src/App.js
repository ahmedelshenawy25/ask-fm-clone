import './App.css';
import React from 'react';
import {
  Route, Switch, withRouter, Redirect
} from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import DisplayAnsweredQuestions from './components/Questions/DisplayAnsweredQuestions';
import Inbox from './components/Questions/Inbox';
import SearchResult from './components/Search/SearchResult';
import Home from './components/Home/Home';

class App extends React.Component {
  state = {
    isAuth: false,
    token: '',
    username: ''
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!token || !username) {
      return this.logoutHandler();
    }
    return this.setState({
      isAuth: true,
      token,
      username
    });
  }

  AuthHandler = () => {
    this.setState({
      isAuth: true,
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username')
    });
  }

  logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.setState({
      isAuth: false,
      token: ''
    });
  }

  render() {
    let routes;
    if (!this.state.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/signup"
            render={props => (
              <Signup {...props} />
            )}
          />
          <Route
            path="/login"
            render={props => (
              <Login {...props} onLogin={this.AuthHandler} />
            )}
          />
          <Redirect to="/login" />
        </Switch>
      );
    }
    return (
      <div className="ui container">
        <Navbar
          isAuth={this.state.isAuth}
          username={this.state.username}
          onLogout={this.logoutHandler}
        />
        <Switch>
          <Route
            path="/"
            exact
            render={() => <Redirect to="/home" />}
          />
          <Route
            path="/home"
            render={props => (
              <Home key={props.location.key} {...props} token={this.state.token} />
            )}
          />
          <Route
            path="/account/inbox"
            render={props => (
              <Inbox {...props} token={this.state.token} username={this.state.username} />
            )}
          />
          <Route
            path="/user/:username"
            render={props => (
              <DisplayAnsweredQuestions
                key={this.props.location.pathname}
                {...props}
                token={this.state.token}
              />
            )}
          />
          <Route
            path="/search"
            render={props => (
              <SearchResult
                key={props.history.location.search}
                search={props.history.location.search.replace('?q=', '')}
                {...props}
                token={this.state.token}
              />
            )}
          />
          {routes}
          <Route render={() => <h1 style={{ textAlign: 'center' }}>404 Page not found</h1>} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
