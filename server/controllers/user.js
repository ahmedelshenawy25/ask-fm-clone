const UsersDAL = require('../modules/users/usersDAL');
const Follow = require('../models/follow');

exports.search = async (req, res) => {
  try {
    const searchTerm = req.query.q.trim();
    const searchQueryRegex = new RegExp(searchTerm, 'gi');

    const users = await UsersDAL.findUsersByFullnameOrUsernameRegEx(searchQueryRegex, req.userId);
    // add isFollowed property to users being followed by req.userId
    const modifiedUsers = await Promise.all(users.map(async (user) => {
      const found = await Follow.findOne({
        followingUser: req.userId,
        followedUser: user._id
      });
      if (found) {
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

    res.status(200).send(modifiedUsers);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.friends = async (req, res) => {
  try {
    const followedUsers = await Follow.find({
      followingUser: req.userId
    }, '-_id followedUser')
      .populate('followedUser', 'username firstName lastName');
    res.status(200).send(followedUsers);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.discover = async (req, res) => {
  try {
    const followedUsers = await Follow.find({
      followingUser: req.userId
    }, '-_id followedUser')
      .distinct('followedUser');
    followedUsers.push(req.userId);

    const suggestedUsers = await UsersDAL.suggestUnfollowedUsers(followedUsers);
    res.status(200).send(suggestedUsers);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.follow = async (req, res) => {
  try {
    const followedUser = await UsersDAL.findUserByUsername(req.params.username);
    const followingUser = await UsersDAL.findUserById(req.userId);
    if (!followedUser || !followingUser) {
      throw new Error('User not found');
    }

    const isFollowed = await Follow.findOne({
      followedUser,
      followingUser
    });
    if (isFollowed) {
      throw new Error('User is already being followed');
    }

    const follow = new Follow({
      followedUser,
      followingUser
    });
    await follow.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const followedUser = await UsersDAL.findUserByUsername(req.params.username);
    const followingUser = await UsersDAL.findUserById(req.userId);
    if (!followedUser || !followingUser) {
      throw new Error('User not found');
    }

    const isFollowed = await Follow.findOne({
      followedUser,
      followingUser
    });
    if (!isFollowed) {
      throw new Error('User isn\'t followed');
    }

    await isFollowed.remove();
    res.status(204).send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};