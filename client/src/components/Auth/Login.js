import React from 'react';
import axios from 'axios';

class Login extends React.Component {
    state = {
      login: '',
      password: '',
      error: ''
    }

    loginHandler = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.post('/api/login', {
          ...this.state
        });
        if (response.status !== 200) {
          throw new Error('Login failed');
        }
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        this.props.onLogin();
        this.props.history.push('/');
      } catch (e) {
        this.setState({
          isAuth: false,
          token: '',
          username: '',
          error: e.response ? e.response.data.message : e.message
        });
      }
    }

    handleInputChange = (event) => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    render() {
      const { login, password } = this.state;
      return (
        <div>
          { this.state.error && (
            <div className="ui warning message">
              <div className="header">
                {this.state.error}
              </div>
            </div>
          )}
          <form onSubmit={this.loginHandler} className="ui form">
            <div className="field">
              <input
                type="text"
                name="login"
                value={login}
                onChange={this.handleInputChange}
                placeholder="Username"
              />
            </div>
            <div className="field">
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                placeholder="Password"
              />
            </div>
            <button className="ui button" type="submit">Login</button>
          </form>
        </div>
      );
    }
}

export default Login;
