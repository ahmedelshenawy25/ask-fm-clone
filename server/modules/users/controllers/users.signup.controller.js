const { userSignupService } = require('../services');

module.exports = async (req, res, next) => {
  try {
    const userSignupForm = req.body;
    await userSignupService(userSignupForm);
    return res.status(201).json();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};