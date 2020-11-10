const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res) => {
  try {
    const { userId } = req;
    const { username } = req.params;

    const followedUser = await UsersDAL.findUserIdByUsername(username);
    if (!followedUser || userId === followedUser._id.toString()) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isFollowed = await FollowsDAL.isFollowed(followedUser, userId);
    if (!isFollowed) {
      return res.status(400).json({ message: 'User isn\'t followed' });
    }

    await FollowsDAL.delete(followedUser, userId);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};