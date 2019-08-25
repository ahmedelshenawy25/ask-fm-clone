import React from 'react';
import { NavLink } from 'react-router-dom';
import SearchBar from '../Search/SearchBar';

const Navbar = ({ isAuth, onLogout, username }) => {
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

export default Navbar;
