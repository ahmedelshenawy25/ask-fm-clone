import React from 'react';
import { NavLink } from 'react-router-dom';

const PublicNavbar = () => (
  <div className="ui secondary pointing menu">
    <div className="right menu">
      <NavLink to="/signup" className="ui item">Signup</NavLink>
      <NavLink to="/login" className="ui item">Login</NavLink>
    </div>
  </div>
);

export default PublicNavbar;
