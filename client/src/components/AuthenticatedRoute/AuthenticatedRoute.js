/* eslint-disable react/forbid-prop-types */
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from '../../context/AuthContext/AuthContext';


const AuthenticatedRoute = ({ children, path }) => {
  const isAuth = useContext(AuthContext);
  return isAuth ? <Route path={path}>{children}</Route> : <Redirect to="/login" />;
};

AuthenticatedRoute.propTypes = {
  children: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

export default AuthenticatedRoute;
