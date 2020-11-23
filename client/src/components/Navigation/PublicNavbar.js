import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const PublicNavbar = () => (
  <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
    <Button component={RouterLink} to="/signup">Signup</Button>
    <Button component={RouterLink} to="/login">Login</Button>
  </div>
);

export default PublicNavbar;
