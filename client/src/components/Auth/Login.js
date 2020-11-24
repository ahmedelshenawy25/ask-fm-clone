import React, { useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage
} from 'formik';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axiosInstance from '../../axiosInstance/axiosInstance';
import loginValidationSchema from './login.validationSchema';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = ({ onLogin }) => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState('');

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        { error }
        <Formik
          initialValues={{
            usernameOrEmail: '',
            password: ''
          }}
          validationSchema={loginValidationSchema}
          onSubmit={async (values) => {
            const castValues = loginValidationSchema.cast(values);
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
            <Form>
              <Field
                name="usernameOrEmail"
                placeholder="Username or email"
                as={TextField}
                variant="outlined"
                size="small"
                fullWidth
                margin="normal"
              />
              <ErrorMessage name="usernameOrEmail" />
              <Field
                type="password"
                name="password"
                placeholder="Password"
                as={TextField}
                variant="outlined"
                size="small"
                fullWidth
                margin="normal"
              />
              <ErrorMessage name="password" />
              <Button
                disabled={!(isValid && dirty) || isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Log In
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default Login;
