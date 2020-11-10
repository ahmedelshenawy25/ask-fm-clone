const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res) => {
  try {
    const { userId } = req;

    const followedUsersIds = await FollowsDAL.findUserFriendsIds(userId);
    followedUsersIds.push(userId);

    const suggestedUsers = await UsersDAL.suggestUnfollowedUsers(followedUsersIds);
    return res.status(200).json(suggestedUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};