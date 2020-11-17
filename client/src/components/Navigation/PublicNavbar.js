import React from 'react';
import { NavLink } from 'react-router-dom';

const PublicNavbar = () => (
  <div>
    <NavLink to="/signup">Signup</NavLink>
    <NavLink to="/login">Login</NavLink>
  </div>
);

export default PublicNavbar;
