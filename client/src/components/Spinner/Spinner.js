import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  spinner: {
    display: 'block',
    margin: 'auto'
  }
});

const Spinner = ({ isLoading }) => {
  const classes = useStyles();

  return isLoading && <CircularProgress className={classes.spinner} />;
};

Spinner.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default Spinner;
