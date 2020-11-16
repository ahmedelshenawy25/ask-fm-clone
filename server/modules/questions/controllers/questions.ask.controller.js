const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');
const { USER_NOT_FOUND } = require('../errors');
const { ResourceNotFoundError } = require('@helpers/error-management/common.errors');

module.exports = async (req, res, next) => {
  try {
    const sender = req.userId;
    const { username } = req.params;
    const { question, isAnonymous } = req.body;

    const recipient = await UsersDAL.findUserIdByUsername(username);
    if (!recipient)
      throw ResourceNotFoundError(USER_NOT_FOUND);

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