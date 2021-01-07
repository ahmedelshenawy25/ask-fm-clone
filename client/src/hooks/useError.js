import { useState } from 'react';

const useError = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const errorHandler = (e) => {
    setError(e);
    setOpen(true);
  };

  const closeHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setError('');
  };

  return {
    open,
    error,
    errorHandler,
    closeHandler
  };
};

export default useError;
