const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req;
    const { q: searchTerm, page, limit } = req.query;

    let users = [];
    const skip = (page - 1) * limit;
    const searchQueryRegex = new RegExp(searchTerm, 'gi');

    const usersCount = await UsersDAL.findUsersCountByFullnameOrUsernameRegEx({
      searchQueryRegex,
      currentUserId: userId
    });
    if (!usersCount)
      return res.status(200).json({ users, usersCount });

    users = await UsersDAL.findUsersByFullnameOrUsernameRegEx({
      searchQueryRegex,
      currentUserId: userId,
      skip,
      limit
    });
    users = await addIsFollowedProperty(users, userId);

    return res.status(200).json({ users, usersCount });
  } catch (error) {
    next(error);
  }
};

async function addIsFollowedProperty (users, userId) {
  const usersPromises = users.map(async (user) => {
    const isFollowed = await FollowsDAL.isFollowed(user._id, userId);
    user.isFollowed = isFollowed;
    return user;
  });

  return await Promise.all(usersPromises);
}