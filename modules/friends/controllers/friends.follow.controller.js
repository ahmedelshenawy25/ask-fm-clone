const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');
const { USER_NOT_FOUND, USER_FOLLOWED, USER_CANT_FOLLOW } = require('../errors');
const { ResourceNotFoundError, OperationNotAllowedError } = require('@helpers/error-management/common.errors');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { username } = req.params;

    const userToBeFollowed = await UsersDAL.findUserIdByUsername(username);
    if (!userToBeFollowed)
      throw ResourceNotFoundError(USER_NOT_FOUND);
    if (userId === userToBeFollowed._id.toString())
      throw OperationNotAllowedError(USER_CANT_FOLLOW);

    const isFollowed = await FollowsDAL.isFollowed(userToBeFollowed, userId);
    if (isFollowed)
      throw OperationNotAllowedError(USER_FOLLOWED);

    await FollowsDAL.create(userToBeFollowed, userId);

    return res.status(201).json();
  } catch (error) {
    next(error);
  }
};