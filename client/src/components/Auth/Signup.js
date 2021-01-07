import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axiosInstance from '../../axiosInstance/axiosInstance';
import signupValidationSchema from './signup.validationSchema';
import ErrorContext from '../../context/ErrorContext';

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

const Signup = () => {
  const classes = useStyles();
  const history = useHistory();
  const errorHandler = useContext(ErrorContext);

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
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
              const error = e.response ? e.response.data.message : e.message;
              errorHandler(error);
            }
          }}
        >
          {({
            isValid, dirty, isSubmitting, errors, touched
          }) => (
            <div>
              <Form>
                <Field
                  name="firstName"
                  placeholder="First name"
                  as={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  error={touched.firstName && errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
                <Field
                  name="lastName"
                  placeholder="Last name"
                  as={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  error={touched.lastName && errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
                <Field
                  name="username"
                  placeholder="Username"
                  as={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  error={touched.username && errors.username}
                  helperText={touched.username && errors.username}
                />
                <Field
                  name="email"
                  placeholder="Email"
                  as={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  error={touched.email && errors.email}
                  helperText={touched.email && errors.email}
                />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  as={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  error={touched.password && errors.password}
                  helperText={touched.password && errors.password}
                />
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  as={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  error={touched.confirmPassword && errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                <Button
                  disabled={!(isValid && dirty) || isSubmitting}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Submit
                </Button>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default Signup;
