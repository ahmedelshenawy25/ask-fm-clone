const UsersDAL = require('@UsersDAL');

module.exports = async (req, res, next) => {
  try {
    const userSignupForm = req.body;
    const { username, email } = userSignupForm;

    const user = await UsersDAL.findUserIdByUsernameOrEmail(username, email);
    if (user && user.username === username) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    if (user && user.email === email) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    await UsersDAL.createUser(userSignupForm);

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};