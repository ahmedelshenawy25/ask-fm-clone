import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import AppRouter from './router/AppRouter';
import Navbar from './components/Navigation/Navbar';
import AuthContext from './context/AuthContext';
import useAuth from './hooks/useAuth';
import ErrorContext from './context/ErrorContext';
import useError from './hooks/useError';
import ErrorAlert from './components/Alert/ErrorAlert';
import Spinner from './components/Spinner/Spinner';

const App = () => {
  const {
    isAuth, username, loginHandler, logoutHandler, isLoading
  } = useAuth();
  const {
    open, error, errorHandler, closeHandler
  } = useError();

  if (isLoading) {
    return (
      <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
        <Spinner isLoading={isLoading} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={isAuth}>
      <ErrorContext.Provider value={errorHandler}>
        <CssBaseline />
        <Navbar username={username} />
        <Container maxWidth="md">
          <AppRouter
            loginHandler={loginHandler}
            logoutHandler={logoutHandler}
          />
        </Container>
        <ErrorAlert
          open={open}
          error={error}
          closeHandler={closeHandler}
        />
      </ErrorContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
