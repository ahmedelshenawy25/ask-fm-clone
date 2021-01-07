import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from '../Search/SearchBar';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  root: {
    display: 'inline-flex',
    flexGrow: 1,
    '& > *': {
      [theme.breakpoints.up('sm')]: {
        marginRight: theme.spacing(10)
      }
    }
  }
}));

const PrivateNavbar = ({ username }) => {
  const classes = useStyles();
  return (
    <div className={classes.flex}>
      <div className={classes.grow} />
      <div className={classes.root}>
        <Button component={RouterLink} to="/home">Home</Button>
        <Button component={RouterLink} to={`/user/${username}`}>Profile</Button>
        <Button component={RouterLink} to="/account/inbox">Inbox</Button>
        <SearchBar />
      </div>
      <div>
        <Button component={RouterLink} to="/logout">Logout</Button>
      </div>
    </div>
  );
};

PrivateNavbar.propTypes = {
  username: PropTypes.string.isRequired
};

export default PrivateNavbar;
