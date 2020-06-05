const UsersDAL = require('../usersDAL');

module.exports = async (userSignupForm) => {
  try {
    const { username, email } = userSignupForm;
    const user = await UsersDAL.findUserByUsernameOrEmail(username, email);
    if (user && user.username === username) throw new Error('Username already exists');
    if (user && user.email === email) throw new Error('Email already exists');

    return await UsersDAL.createUser(userSignupForm);
  } catch (error) {
    throw error;
  }
};