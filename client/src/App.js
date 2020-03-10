import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Navbar from './components/Navigation/Navbar';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import DisplayAnsweredQuestions from './components/Questions/DisplayAnsweredQuestions';
import Inbox from './components/Questions/Inbox';
import SearchResult from './components/Search/SearchResult';
import Home from './components/Home/Home';
import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute/UnauthenticatedRoute';
import AuthContext from './context/AuthContext/AuthContext';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoadingInitialState, setIsLoadingInitialState] = useState(true);

  const logoutHandler = () => {
    localStorage.clear();
    setIsAuth(false);
    setIsLoadingInitialState(false);
  };

  useEffect(() => {
    const { token } = localStorage;
    const parsedToken = token && token.split('.')[1] ? JSON.parse(
      atob(token.split('.')[1])
    ) : null;
    const tokenExpirationTime = parsedToken && parsedToken.exp;
    const tokenUsername = parsedToken && parsedToken.username;

    const currentTime = Math.trunc(new Date() / 1000);

    if (!token || currentTime > tokenExpirationTime) {
      return logoutHandler();
    }
    setIsAuth(true);
    setUsername(tokenUsername);
    setIsLoadingInitialState(false);
  }, [localStorage.token]);

  const authHandler = () => {
    setIsAuth(true);
    setUsername(localStorage.username);
  };

  if (isLoadingInitialState) {
    return <div>Spinner placeholder...</div>;
  }
  return (
    <AuthContext.Provider value={isAuth}>
      <div>
        <Navbar username={username} onLogout={logoutHandler} />
        <div className="ui container">
          <Switch>
            <Redirect from="/" to="/home" exact />
            <Redirect from="/logout" to="/login" />

            <UnauthenticatedRoute path="/signup">
              <Signup />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute path="/login">
              <Login onLogin={authHandler} />
            </UnauthenticatedRoute>

            <AuthenticatedRoute path="/home">
              <Home logout={logoutHandler} />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/account/inbox">
              <Inbox logout={logoutHandler} />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/user/:username">
              <DisplayAnsweredQuestions logout={logoutHandler} />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/search">
              <SearchResult logout={logoutHandler} />
            </AuthenticatedRoute>

            <Route>
              <h1 style={{ textAlign: 'center' }}>404 Page not found</h1>
            </Route>
          </Switch>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
