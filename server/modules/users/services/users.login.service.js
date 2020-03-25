const UsersDAL = require('../usersDAL');

module.exports = async (usernameOrEmail, password) => {
  try {
    const user = await UsersDAL.login(usernameOrEmail, password);
    if (!user) throw new Error('Invalid username or password');
    const token = UsersDAL.generateAuthToken(user);
    return { token, username: user.username };
  } catch (error) {
    throw error;
  }
};