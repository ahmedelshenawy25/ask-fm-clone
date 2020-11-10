const UsersDAL = require('@UsersDAL');

module.exports = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await UsersDAL.login(usernameOrEmail, password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = UsersDAL.generateAuthToken(user);

    return res.status(200).json({ token, username: user.username });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};