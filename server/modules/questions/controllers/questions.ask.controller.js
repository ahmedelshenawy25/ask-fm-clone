const UsersDAL = require('../../users/usersDAL');
const QuestionsDAL = require('../questionsDAL');

module.exports = async (req, res, next) => {
  try {
    const sender = req.userId;
    const { username } = req.params;
    const { question, isAnonymous } = req.body;

    const recipient = await UsersDAL.findUserIdByUsername(username);
    if (!recipient) {
      throw new Error('User not found.');
    }

    await QuestionsDAL.createQuestion({
      recipient: recipient._id,
      sender,
      question,
      isAnonymous
    });

    return res.status(201).json();
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};