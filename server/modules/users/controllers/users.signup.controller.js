const OperationalError = require('@helpers/error-management/operatinal.error');
const UsersDAL = require('@UsersDAL');

module.exports = async (req, res, next) => {
  try {
    const userSignupForm = req.body;
    const { username, email } = userSignupForm;

    const user = await UsersDAL.findUserIdByUsernameOrEmail(username, email);
    if (user && user.username === username)
      throw new OperationalError('Username already exists', 409);
    if (user && user.email === email)
      throw new OperationalError('Email already exists', 409);

    await UsersDAL.createUser(userSignupForm);

    return res.status(201).json();
  } catch (error) {
    next(error);
  }
};