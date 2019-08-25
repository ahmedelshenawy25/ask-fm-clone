import React from 'react';
import axios from 'axios';

class Signup extends React.Component {
    state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: ''
    }

    signupHandler = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.post('/api/signup', {
          ...this.state
        });
        if (response.status !== 201) {
          throw new Error('Creating user failed');
        }
        this.props.history.push('/login');
      } catch (e) {
        this.setState({
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
      const {
        firstName, lastName, username, email, password, confirmPassword
      } = this.state;
      return (
        <div>
          { this.state.error && (
            <div className="ui warning message">
              <div className="header">
                {this.state.error}
              </div>
            </div>
          )}
          <form onSubmit={this.signupHandler} className="ui form">
            <div className="field">
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={this.handleInputChange}
                placeholder="First Name"
                required
              />
            </div>
            <div className="field">
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={this.handleInputChange}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="field">
              <input
                type="text"
                name="username"
                value={username}
                onChange={this.handleInputChange}
                placeholder="Username"
                required
              />
            </div>
            <div className="field">
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
                placeholder="E-mail"
                required
              />
            </div>
            <div className="field">
              <input
                type="password"
                name="password"
                minLength="8"
                value={password}
                onChange={this.handleInputChange}
                placeholder="Password"
              />
            </div>
            <div className="field">
              <input
                type="password"
                name="confirmPassword"
                minLength="8"
                value={confirmPassword}
                onChange={this.handleInputChange}
                placeholder="Confirm Password"
              />
            </div>
            <button className="ui button" type="submit">Submit</button>
          </form>
        </div>
      );
    }
}

export default Signup;
