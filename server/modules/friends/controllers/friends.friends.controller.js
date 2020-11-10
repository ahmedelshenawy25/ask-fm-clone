const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res) => {
  try {
    const { userId } = req;

    const friends = await FollowsDAL.findUserFriends(userId);

    return res.status(200).json(friends);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};