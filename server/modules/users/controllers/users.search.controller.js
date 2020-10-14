const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res) => {
  try {
    const { userId } = req;
    const searchTerm = req.query.q.trim();
    const searchQueryRegex = new RegExp(searchTerm, 'gi');

    const users = await UsersDAL.findUsersByFullnameOrUsernameRegEx(searchQueryRegex, userId);
    // add isFollowed property to users being followed by req.userId
    const modifiedUsers = await Promise.all(users.map(async (user) => {
      const isFollowed = await FollowsDAL.isFollowed(user._id, userId);
      if (isFollowed) {
        return ({
          ...user,
          isFollowed: true
        });
      }
      return ({
        ...user,
        isFollowed: false
      });
    }));

    return res.status(200).json(modifiedUsers);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};