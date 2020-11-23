import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import SearchBar from '../Search/SearchBar';

const PrivateNavbar = ({ username, onLogout }) => (
  <div style={{ display: 'flex', flexGrow: 1 }}>
    <div style={{ display: 'inline-flex', flexGrow: 1 }}>
      <Button component={RouterLink} to="/home">Home</Button>
      <Button component={RouterLink} to={`/user/${username}`}>Profile</Button>
      <Button component={RouterLink} to="/account/inbox">Inbox</Button>
      <SearchBar />
    </div>
    <div>
      <Button component={RouterLink} to="/logout" onClick={() => onLogout()}>Logout</Button>
    </div>
  </div>
);

PrivateNavbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default PrivateNavbar;
