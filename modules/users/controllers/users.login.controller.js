const UsersDAL = require('@UsersDAL');
const { INVALID_USERNAME_OR_PASSWORD } = require('../errors');
const { InvalidInputError } = require('@helpers/error-management/common.errors');

module.exports = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await UsersDAL.login(usernameOrEmail, password);
    if (!user)
      throw InvalidInputError(INVALID_USERNAME_OR_PASSWORD);

    const token = UsersDAL.generateAuthToken(user);

    return res.status(200).json({ token, username: user.username });
  } catch (error) {
    next(error);
  }
};