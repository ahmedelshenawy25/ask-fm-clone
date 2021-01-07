import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Logout = ({ logoutHandler }) => {
  useEffect(() => {
    logoutHandler();
  }, []);

  return <div />;
};

Logout.propTypes = {
  logoutHandler: PropTypes.func.isRequired
};
export default Logout;
