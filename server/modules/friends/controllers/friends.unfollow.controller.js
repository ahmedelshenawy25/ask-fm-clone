const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');
const { USER_NOT_FOUND, USER_NOT_FOLLOWED, USER_CANT_UNFOLLOW } = require('../errors');
const { ResourceNotFoundError, OperationNotAllowedError } = require('@helpers/error-management/common.errors');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { username } = req.params;

    const userToBeUnfollowed = await UsersDAL.findUserIdByUsername(username);
    if (!userToBeUnfollowed)
      throw ResourceNotFoundError(USER_NOT_FOUND);
    if (userId === userToBeUnfollowed._id.toString())
      throw OperationNotAllowedError(USER_CANT_UNFOLLOW);

    const isFollowed = await FollowsDAL.isFollowed(userToBeUnfollowed, userId);
    if (!isFollowed)
      throw OperationNotAllowedError(USER_NOT_FOLLOWED);

    await FollowsDAL.delete(userToBeUnfollowed, userId);

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};