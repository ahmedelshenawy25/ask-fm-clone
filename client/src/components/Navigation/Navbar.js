import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../../context/AuthContext/AuthContext';
import PrivateNavbar from './PrivateNavbar';
import PublicNavbar from './PublicNavbar';

const useStyles = makeStyles({
  navbar: {
    marginBottom: '80px'
  }
});
const Navbar = ({ onLogout, username }) => {
  const classes = useStyles();
  const isAuth = useContext(AuthContext);
  return (
    <div className={classes.navbar}>
      <AppBar>
        <Toolbar>
          { isAuth ? <PrivateNavbar username={username} onLogout={onLogout} /> : <PublicNavbar /> }
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default Navbar;
