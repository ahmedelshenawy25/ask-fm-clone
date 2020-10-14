const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res) => {
  try {
    const { userId } = req;

    const friends = await FollowsDAL.findUserFriends(userId);

    return res.status(200).json(friends);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};