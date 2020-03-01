import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';


const Login = ({ onLogin }) => {
  const history = useHistory();
  const [error, setError] = useState('');

  return (
    <>
      {error && (
        <div className="ui warning message">
          <div className="header">
            {error}
          </div>
        </div>
      )}
      <Formik
        initialValues={{ login: '', password: '' }}
        onSubmit={async (values) => {
          try {
            const response = await axios.post('/api/login', {
              ...values
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);

            onLogin();
            history.push('/');
          } catch (e) {
            setError(e.response ? e.response.data.message : e.message);
          }
        }}
      >
        <Form className="ui form">
          <div className="field">
            <Field name="login" placeholder="Username" />
          </div>
          <div className="field">
            <Field type="password" name="password" placeholder="Password" />
          </div>
          <button className="ui button" type="submit">Login</button>
        </Form>
      </Formik>
    </>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default Login;
