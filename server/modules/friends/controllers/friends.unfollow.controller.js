const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');
const OperationalError = require('@helpers/error-management/operatinal.error');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { username } = req.params;

    const followedUser = await UsersDAL.findUserIdByUsername(username);
    if (!followedUser || userId === followedUser._id.toString())
      throw new OperationalError('User not found', 400);

    const isFollowed = await FollowsDAL.isFollowed(followedUser, userId);
    if (!isFollowed)
      throw new OperationalError('User isn\'t followed', 400);

    await FollowsDAL.delete(followedUser, userId);

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};