const { ConflictError } = require('@helpers/error-management/common.errors');
const UsersDAL = require('@UsersDAL');
const { USERNAME_EXIST, EMAIL_EXIST } = require('../errors');

module.exports = async (req, res, next) => {
  try {
    const userSignupForm = req.body;
    const { username, email } = userSignupForm;

    const user = await UsersDAL.findUserIdByUsernameOrEmail(username, email);
    if (user && user.username === username)
      throw ConflictError(USERNAME_EXIST);
    if (user && user.email === email)
      throw ConflictError(EMAIL_EXIST);

    await UsersDAL.createUser(userSignupForm);

    return res.status(201).json();
  } catch (error) {
    next(error);
  }
};