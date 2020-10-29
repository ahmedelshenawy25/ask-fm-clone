import React, { useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage
} from 'formik';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../axiosInstance/axiosInstance';
import signupValidationSchema from './signup.validationSchema';

const Signup = () => {
  const history = useHistory();
  const [error, setError] = useState('');

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={signupValidationSchema}
      onSubmit={async (values) => {
        const { confirmPassword, ...castValues } = signupValidationSchema.cast(values);
        try {
          await axiosInstance.post('/signup', {
            ...castValues
          });
          history.push('/login');
        } catch (e) {
          setError(e.response ? e.response.data.message : e.message);
        }
      }}
    >
      {({ isValid, dirty, isSubmitting }) => (
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
              <ErrorMessage name="firstName" />
            </div>

            <div className="field">
              <Field name="lastName" placeholder="Last name" />
              <ErrorMessage name="lastName" />
            </div>

            <div className="field">
              <Field name="username" placeholder="Username" />
              <ErrorMessage name="username" />
            </div>

            <div className="field">
              <Field name="email" placeholder="Email" />
              <ErrorMessage name="email" />
            </div>

            <div className="field">
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" />
            </div>

            <div className="field">
              <Field type="password" name="confirmPassword" placeholder="Confirm password" />
              <ErrorMessage name="confirmPassword" />
            </div>

            <button className="ui button" disabled={!(isValid && dirty) || isSubmitting} type="submit">Submit</button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default Signup;
