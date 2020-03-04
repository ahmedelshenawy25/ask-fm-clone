import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthContext from '../AuthContext/AuthContext';
import SearchBar from '../Search/SearchBar';

const Navbar = ({ onLogout, username }) => {
  const isAuth = useContext(AuthContext);
  let authNavItems;
  if (!isAuth) {
    authNavItems = (
      <div className="ui secondary pointing menu">
        <div className="right menu">
          <NavLink to="/signup" className="ui item">Signup</NavLink>
          <NavLink to="/login" className="ui item">Login</NavLink>
        </div>
      </div>
    );
  } else {
    authNavItems = (
      <div className="ui secondary pointing menu">
        <NavLink to="/home" exact className="item">Home</NavLink>
        <NavLink to={`/user/${username}`} className="item">Profile</NavLink>
        <NavLink to="/account/inbox" className="item">Inbox</NavLink>
        <SearchBar />
        <div className="right menu">
          <NavLink to="/logout" className="ui item" onClick={() => onLogout()}>Logout</NavLink>
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: '0.5%' }}>
      { authNavItems }
    </div>
  );
};

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default Navbar;
