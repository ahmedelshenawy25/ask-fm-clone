import React, { useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage
} from 'formik';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import axiosInstance from '../../axiosInstance/axiosInstance';

const Signup = () => {
  const history = useHistory();
  const [error, setError] = useState('');

  const signupSchema = Yup.object().shape({
    firstName: Yup.string().label('First name').trim()
      .min(1, 'First name must be between 1 and 50 characters')
      .max(50, 'First name must be between 1 and 50 characters')
      .required('Please enter your first name'),
    lastName: Yup.string().label('Last name').trim()
      .min(1, 'Last name must be between 1 and 50 characters')
      .max(50, 'Last name must be between 1 and 50 characters')
      .required('Please enter your last name'),
    username: Yup.string().label('Username').trim()
      .matches(/^(\w){4,25}$/, 'Username must be between 4 and 25 characters long and consist only of alphanumerics and underscores')
      .required('Please enter a username'),
    email: Yup.string().label('Email').trim().email('Enter a valid email')
      .required('Please enter an email'),
    password: Yup.string().trim().label('Password')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,64}$/,
        'Password must be at least 8 characters long with at least 1 (lowercase letter, uppercase letter, number and special character)')
      .required('Password is required'),
    confirmPassword: Yup.string().label('Confirm password')
      .oneOf([Yup.ref('password'), null], 'Passwords do not match').required('Password is required')
  });

  return (
    <Formik
      initialValues={{
        firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: ''
      }}
      validationSchema={signupSchema}
      onSubmit={async (values) => {
        const castValues = signupSchema.cast(values);
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
