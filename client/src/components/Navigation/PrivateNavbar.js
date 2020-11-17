import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import SearchBar from '../Search/SearchBar';

const PrivateNavbar = ({ username, onLogout }) => (
  <div>
    <NavLink to="/home" exact>Home</NavLink>
    <NavLink to={`/user/${username}`}>Profile</NavLink>
    <NavLink to="/account/inbox">Inbox</NavLink>
    <SearchBar />
    <div>
      <NavLink to="/logout" onClick={() => onLogout()}>Logout</NavLink>
    </div>
  </div>
);

PrivateNavbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default PrivateNavbar;
