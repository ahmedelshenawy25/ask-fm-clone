import * as Yup from 'yup';

const signupValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .label('First name')
    .trim()
    .min(1, 'First name must be between 1 and 50 characters')
    .max(50, 'First name must be between 1 and 50 characters')
    .required('First name required'),
  lastName: Yup.string()
    .label('Last name')
    .trim()
    .min(1, 'Last name must be between 1 and 50 characters')
    .max(50, 'Last name must be between 1 and 50 characters')
    .required('Last name required'),
  username: Yup.string()
    .label('Username')
    .trim()
    .matches(/^(\w){4,25}$/, 'Username must be between 4 and 25 characters long and consist only of alphanumerics and underscores')
    .required('Username required'),
  email: Yup.string()
    .label('Email')
    .trim()
    .email('Enter a valid email')
    .required('Email required'),
  password: Yup.string()
    .trim()
    .label('Password')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,64}$/,
      'Password must be at least 8 characters long with at least 1 (lowercase letter, uppercase letter, number and special character)')
    .required('Password required'),
  confirmPassword: Yup.string()
    .label('Confirm password')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Password confirmation required')
});

export default signupValidationSchema;
