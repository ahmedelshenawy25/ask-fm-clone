const UsersDAL = require('@UsersDAL');

module.exports = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await UsersDAL.login(usernameOrEmail, password);
    if (!user) throw new Error('Invalid username or password'); // 400

    const token = UsersDAL.generateAuthToken(user);

    return res.status(200).json({ token, username: user.username });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};