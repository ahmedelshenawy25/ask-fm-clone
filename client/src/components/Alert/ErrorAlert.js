import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

const ErrorAlert = ({ open, error, closeHandler }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={closeHandler}
  >
    <Alert
      onClose={closeHandler}
      severity="error"
      variant="filled"
    >
      {error}
    </Alert>
  </Snackbar>
);

ErrorAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired
};

export default ErrorAlert;
