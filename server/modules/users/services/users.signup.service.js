const UsersDAL = require('../usersDAL');

module.exports = async (userSignupForm) => {
  try {
    const username = await UsersDAL.findUserByUsername(userSignupForm.username);
    if (username) throw new Error('Username already exists');
    const email = await UsersDAL.findUserByEmail(userSignupForm.email);
    if (email) throw new Error('Email already exists');

    await UsersDAL.createUser(userSignupForm);
  } catch (error) {
    throw error;
  }
};