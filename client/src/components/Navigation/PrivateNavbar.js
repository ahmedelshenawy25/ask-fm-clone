import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import SearchBar from '../Search/SearchBar';

const PrivateNavbar = ({ username, onLogout }) => (
  <div>
    <Button component={Link} to="/home">Home</Button>
    <Button component={Link} to={`/user/${username}`}>Profile</Button>
    <Button component={Link} to="/account/inbox">Inbox</Button>
    {/* <SearchBar /> */}
    <Button component={Link} to="/logout" onClick={() => onLogout()}>Logout</Button>
  </div>
);

PrivateNavbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default PrivateNavbar;
