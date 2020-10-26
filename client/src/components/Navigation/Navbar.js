import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../../context/AuthContext/AuthContext';
import PrivateNavbar from './PrivateNavbar';
import PublicNavbar from './PublicNavbar';

const Navbar = ({ onLogout, username }) => {
  const isAuth = useContext(AuthContext);
  return (
    <div style={{ marginBottom: '0.5%' }}>
      { isAuth ? <PrivateNavbar username={username} onLogout={onLogout} /> : <PublicNavbar /> }
    </div>
  );
};

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default Navbar;
