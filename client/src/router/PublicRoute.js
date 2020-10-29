import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from '../context/AuthContext/AuthContext';


const PublicRoute = ({ children, path }) => {
  const isAuth = useContext(AuthContext);
  return !isAuth ? <Route path={path}>{children}</Route> : <Redirect to="/" />;
};

PublicRoute.propTypes = {
  children: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired
};

export default PublicRoute;
