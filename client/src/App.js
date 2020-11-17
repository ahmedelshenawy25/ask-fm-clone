import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppRouter from './router/AppRouter';
import Navbar from './components/Navigation/Navbar';
import AuthContext from './context/AuthContext/AuthContext';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoadingInitialState, setIsLoadingInitialState] = useState(true);

  const authHandler = () => {
    setIsAuth(true);
    setUsername(localStorage.username);
  };

  const logoutHandler = () => {
    localStorage.clear();
    setIsAuth(false);
    setIsLoadingInitialState(false);
  };

  useEffect(() => {
    const { token } = localStorage;
    const parsedToken = token && token.split('.')[1] ? JSON.parse(
      atob(token.split('.')[1])
    ) : null;
    const tokenExpirationTime = parsedToken && parsedToken.exp;
    const tokenUsername = parsedToken && parsedToken.username;

    const currentTime = Math.trunc(new Date() / 1000);

    if (!token || currentTime > tokenExpirationTime) {
      return logoutHandler();
    }
    setIsAuth(true);
    setUsername(tokenUsername);
    setIsLoadingInitialState(false);
  }, [localStorage.token]);

  if (isLoadingInitialState) {
    return <div>Spinner placeholder...</div>;
  }

  return (
    <AuthContext.Provider value={isAuth}>
      <CssBaseline />
      <Navbar username={username} onLogout={logoutHandler} />
      <AppRouter authHandler={authHandler} logoutHandler={logoutHandler} />
    </AuthContext.Provider>
  );
};

export default App;
