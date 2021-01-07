import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../../context/AuthContext';
import PrivateNavbar from './PrivateNavbar';
import PublicNavbar from './PublicNavbar';

const useStyles = makeStyles({
  navbar: {
    marginBottom: '80px'
  }
});

const Navbar = ({ username }) => {
  const classes = useStyles();
  const isAuth = useContext(AuthContext);
  return (
    <div className={classes.navbar}>
      <AppBar>
        <Toolbar>
          { isAuth ? <PrivateNavbar username={username} /> : <PublicNavbar /> }
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  username: PropTypes.string.isRequired
};

export default Navbar;
