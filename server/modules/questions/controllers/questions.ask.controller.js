const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');
const OperationalError = require('@helpers/error-management/operatinal.error');

module.exports = async (req, res, next) => {
  try {
    const sender = req.userId;
    const { username } = req.params;
    const { question, isAnonymous } = req.body;

    const recipient = await UsersDAL.findUserIdByUsername(username);
    if (!recipient)
      throw new OperationalError('User not found.', 400);

    await QuestionsDAL.create({
      recipient: recipient._id,
      sender,
      question,
      isAnonymous
    });

    return res.status(201).json();
  } catch (error) {
    next(error);
  }
};