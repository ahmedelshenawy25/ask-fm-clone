const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res) => {
  try {
    const { userId } = req;
    const { username } = req.params;

    const followedUser = await UsersDAL.findUserIdByUsername(username);
    if (!followedUser || userId === followedUser._id.toString()) {
      throw new Error('User not found');
    }

    const isFollowed = await FollowsDAL.isFollowed(followedUser, userId);
    if (isFollowed) {
      throw new Error('User is already being followed');
    }

    await FollowsDAL.create(followedUser, userId);

    return res.status(201).json();
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};