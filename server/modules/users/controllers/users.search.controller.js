const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res) => {
  try {
    const { userId } = req;
    const { q: searchTerm, page, limit } = req.query;
    const searchQueryRegex = new RegExp(searchTerm, 'gi');
    const skip = (page - 1) * limit;

    const usersCount = await UsersDAL.findUsersCountByFullnameOrUsernameRegEx({
      searchQueryRegex,
      currentUserId: userId
    });
    if (!usersCount) return res.status(200).json({ users: [], usersCount });

    const users = await UsersDAL.findUsersByFullnameOrUsernameRegEx({
      searchQueryRegex,
      currentUserId: userId,
      skip,
      limit
    });
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

    return res.status(200).json({ users: modifiedUsers, usersCount });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};