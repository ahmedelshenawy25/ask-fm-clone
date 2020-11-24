import * as Yup from 'yup';

const loginValidationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .trim()
    .required('Username or Email required'),
  password: Yup.string()
    .trim()
    .required('Password required')
});

export default loginValidationSchema;
