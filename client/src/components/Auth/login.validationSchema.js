import * as Yup from 'yup';

const loginValidationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .trim()
    .required('Enter a username or an email'),
  password: Yup.string()
    .trim()
    .required('Enter a password')
});

export default loginValidationSchema;
