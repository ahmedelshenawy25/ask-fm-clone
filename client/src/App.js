import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import AppRouter from './router/AppRouter';
import Navbar from './components/Navigation/Navbar';
import AuthContext from './context/AuthContext/AuthContext';
import useAuth from './hooks/useAuth';

const App = () => {
  const {
    isAuth, username, loginHandler, logoutHandler
  } = useAuth();

  return (
    <AuthContext.Provider value={isAuth}>
      <CssBaseline />
      <Navbar username={username} />
      <Container maxWidth="md">
        <AppRouter
          loginHandler={loginHandler}
          logoutHandler={logoutHandler}
        />
      </Container>
    </AuthContext.Provider>
  );
};

export default App;
