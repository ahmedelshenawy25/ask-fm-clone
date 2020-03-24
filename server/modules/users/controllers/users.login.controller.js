const { userLoginService } = require('../services');

module.exports = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const { token, username } = await userLoginService(usernameOrEmail, password);
    res.status(200).json({ token, username });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};