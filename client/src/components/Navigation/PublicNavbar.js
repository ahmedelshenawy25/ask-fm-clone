import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const PublicNavbar = () => (
  <div>
    <Button component={Link} to="/signup">Signup</Button>
    <Button component={Link} to="/login">Login</Button>
  </div>
);

export default PublicNavbar;
