import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import decodeToken from '../utils/decodeToken';

const useAuth = () => {
  const history = useHistory();
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loginHandler = (token) => {
    const parsedToken = decodeToken(token);
    localStorage.token = token;
    localStorage.username = parsedToken.username;
    setUsername(parsedToken.username);
    setIsAuth(true);
    history.push('/home');
  };

  const logoutHandler = () => {
    localStorage.clear();
    setIsAuth(false);
    history.push('/login');
  };

  useEffect(() => {
    let parsedToken = null;
    const { token } = localStorage;

    if (token) {
      parsedToken = decodeToken(token);
    }
    if (parsedToken) {
      const { exp } = parsedToken;
      const currentTime = Math.trunc(new Date() / 1000);

      if (!exp || currentTime > exp) {
        setIsLoading(false);
        return logoutHandler();
      }
      localStorage.username = parsedToken.username;
      setUsername(parsedToken.username);
      setIsAuth(true);
    }
    setIsLoading(false);
  }, []);

  return {
    isAuth,
    username,
    loginHandler,
    logoutHandler,
    isLoading
  };
};

export default useAuth;
