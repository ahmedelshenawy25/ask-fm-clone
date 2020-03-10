import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useHistory } from 'react-router-dom';

import axiosInstance from '../../axiosInstance/axiosInstance';

const Signup = () => {
  const history = useHistory();
  const [error, setError] = useState('');

  return (
    <Formik
      initialValues={{
        firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: ''
      }}
      onSubmit={async (values) => {
        try {
          await axiosInstance.post('/signup', {
            ...values
          });
          history.push('/login');
        } catch (e) {
          setError(e.response ? e.response.data.message : e.message);
        }
      }}
    >
      <>
        {error && (
          <div className="ui warning message">
            <div className="header">
              {error}
            </div>
          </div>
        )}
        <Form className="ui form">
          <div className="field">
            <Field name="firstName" placeholder="First name" />
          </div>
          <div className="field">
            <Field name="lastName" placeholder="Last name" />
          </div>
          <div className="field">
            <Field name="username" placeholder="Username" />
          </div>
          <div className="field">
            <Field name="email" placeholder="Email" />
          </div>
          <div className="field">
            <Field type="password" name="password" placeholder="Password" />
          </div>
          <div className="field">
            <Field type="password" name="confirmPassword" placeholder="Confirm password" />
          </div>
          <button className="ui button" type="submit">Submit</button>
        </Form>
      </>
    </Formik>
  );
};

export default Signup;
