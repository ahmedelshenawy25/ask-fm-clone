import React, { useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage
} from 'formik';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import axiosInstance from '../../axiosInstance/axiosInstance';

const Login = ({ onLogin }) => {
  const history = useHistory();
  const [error, setError] = useState('');

  const loginSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().trim().required('Enter a username or an email'),
    password: Yup.string().trim().required('Enter a password')
  });

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
        initialValues={{ usernameOrEmail: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={async (values) => {
          const castValues = loginSchema.cast(values);
          try {
            const response = await axiosInstance.post('/login', {
              ...castValues
            });
            localStorage.token = response.data.token;
            localStorage.username = response.data.username;

            onLogin();
            history.push('/home');
          } catch (e) {
            setError(e.response ? e.response.data.message : e.message);
          }
        }}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form className="ui form">
            <div className="field">
              <Field name="usernameOrEmail" placeholder="Username or email" />
              <ErrorMessage name="usernameOrEmail" />
            </div>
            <div className="field">
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" />
            </div>
            <button className="ui button" disabled={!(isValid && dirty) || isSubmitting} type="submit">Login</button>
          </Form>
        )}
      </Formik>
    </>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default Login;
