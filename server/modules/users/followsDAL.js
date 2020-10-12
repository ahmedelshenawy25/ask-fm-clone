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

  async findUserFriends (userId) {
    const followedUsers = await Follow.find({
      followingUser: userId
    }, '-_id followedUser')
      .populate('followedUser', 'username firstName lastName');

    return followedUsers;
  }

  async findUserFriendsIds (userId) {
    const followedUsersIds = await Follow.find({
      followingUser: userId
    }, '-_id followedUser')
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