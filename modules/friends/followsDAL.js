const Follow = require('./follows.model');

class FollowsDAL {
  async create (followedUser, followingUser) {
    await Follow.create({
      followedUser,
      followingUser
    });
  }

  async delete (followedUser, followingUser) {
    await Follow.deleteOne({
      followedUser,
      followingUser
    });
  }

  async findUserFriends ({ userId, skip, limit }) {
    const followedUsers = await Follow.find({
      followingUser: userId
    }, '-_id followedUser')
      .skip(skip)
      .limit(limit)
      .populate('followedUser', 'username firstName lastName');

    return followedUsers;
  }

  async findUserFriendsCount (userId) {
    const followedUsersCount = await Follow.countDocuments({
      followingUser: userId
    });

    return followedUsersCount;
  }

  async findUserFriendsIds (userId) {
    const followedUsersIds = await Follow.find({
      followingUser: userId
    })
      .distinct('followedUser');

    return followedUsersIds;
  }

  async isFollowed (followedUser, followingUser) {
    const follow = await Follow.findOne({
      followedUser,
      followingUser
    });
    return !!follow;
  }
}

module.exports = new FollowsDAL();