import './App.css';
import React, { useState, useEffect } from 'react';
import {
  Route, Switch, useHistory, Redirect, useLocation
} from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import DisplayAnsweredQuestions from './components/Questions/DisplayAnsweredQuestions';
import Inbox from './components/Questions/Inbox';
import SearchResult from './components/Search/SearchResult';
import Home from './components/Home/Home';

const App = () => {
  const history = useHistory();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuth(false);
    setToken('');
    history.push('/login');
  };

  useEffect(() => {
    const storageToken = localStorage.getItem('token');
    const storageUsername = localStorage.getItem('username');
    if (!storageToken || !storageUsername) {
      return logoutHandler();
    }
    setIsAuth(true);
    setToken(storageToken);
    setUsername(storageUsername);
  }, []);

  const authHandler = () => {
    setIsAuth(true);
    setToken(localStorage.getItem('token'));
    setUsername(localStorage.getItem('username'));
  };


  let routes;
  if (!isAuth) {
    routes = (
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login onLogin={authHandler} />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <div>
      <Navbar isAuth={isAuth} username={username} onLogout={logoutHandler} />
      <div className="ui container">
        <Switch>
          <Redirect from="/" to="/home" exact />
          <Route path="/home">
            <Home key={location.key} logout={logoutHandler} token={token} />
          </Route>
          <Route path="/account/inbox">
            <Inbox logout={logoutHandler} token={token} />
          </Route>
          <Route path="/user/:username">
            <DisplayAnsweredQuestions key={location.pathname} logout={logoutHandler} token={token} />
          </Route>
          <Route path="/search">
            <SearchResult key={location.search} search={location.search.replace('?q=', '')} logout={logoutHandler} />
          </Route>
          {routes}
          <Route>
            <h1 style={{ textAlign: 'center' }}>404 Page not found</h1>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;
