const UsersDAL = require('@UsersDAL');

module.exports = async (req, res, next) => {
  try {
    const userSignupForm = req.body;
    const { username, email } = userSignupForm;

    const user = await UsersDAL.findUserIdByUsernameOrEmail(username, email);
    if (user && user.username === username) throw new Error('Username already exists');
    if (user && user.email === email) throw new Error('Email already exists');

    await UsersDAL.createUser(userSignupForm);

    return res.status(201).json();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};