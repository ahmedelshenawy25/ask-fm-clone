import React from 'react';
import {
  Route, Switch, Redirect, useLocation
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Signup from '../components/Auth/Signup';
import Login from '../components/Auth/Login';
import AnsweredQuestionsList from '../components/Questions/AnsweredQuestionsList';
import Inbox from '../components/Questions/Inbox';
import SearchResult from '../components/Search/SearchResult';
import Home from '../components/Home/Home';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Friends from '../components/Friends/Friends';
import Discover from '../components/Discover/Discover';
import Logout from '../components/Auth/Logout';

const AppRouter = ({ loginHandler, logoutHandler }) => {
  const location = useLocation();
  return (
    <Switch key={location.key}>
      <Redirect from="/" to="/home" exact />

      <PublicRoute path="/signup">
        <Signup />
      </PublicRoute>
      <PublicRoute path="/login">
        <Login loginHandler={loginHandler} />
      </PublicRoute>

      <PrivateRoute path="/home">
        <Home />
      </PrivateRoute>
      <PrivateRoute path="/account/inbox">
        <Inbox />
      </PrivateRoute>
      <PrivateRoute path="/user/:username">
        <AnsweredQuestionsList />
      </PrivateRoute>
      <PrivateRoute path="/search">
        <SearchResult />
      </PrivateRoute>
      <PrivateRoute path="/friends">
        <Friends />
      </PrivateRoute>
      <PrivateRoute path="/discover">
        <Discover />
      </PrivateRoute>
      <PrivateRoute path="/logout">
        <Logout logoutHandler={logoutHandler} />
      </PrivateRoute>

      <Route>
        <h1>404 Page not found</h1>
      </Route>
    </Switch>
  );
};

AppRouter.propTypes = {
  loginHandler: PropTypes.func.isRequired,
  logoutHandler: PropTypes.func.isRequired
};

export default AppRouter;
