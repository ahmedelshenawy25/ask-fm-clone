import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from '../context/AuthContext/AuthContext';


const PrivateRoute = ({ children, path }) => {
  const isAuth = useContext(AuthContext);
  return isAuth ? <Route path={path}>{children}</Route> : <Redirect to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired
};

export default PrivateRoute;
