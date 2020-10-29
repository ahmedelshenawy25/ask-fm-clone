import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import SearchBar from '../Search/SearchBar';

const PrivateNavbar = ({ username, onLogout }) => (
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

PrivateNavbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default PrivateNavbar;
