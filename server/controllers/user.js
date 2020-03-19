const User = require('../models/user');
const Follow = require('../models/follow');

exports.signup = async (req, res) => {
  try {
    const username = await User.findOne({ username: req.body.username });
    if (username) {
      throw new Error('Username already exists!');
    }
    const email = await User.findOne({ email: req.body.email });
    if (email) {
      throw new Error('Email already exists!');
    }
    if (req.body.password !== req.body.confirmPassword) {
      throw new Error('Password and password confirmation do not match');
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.login, req.body.password);
    const token = user.generateAuthToken();
    res.status(200).send({ token, username: user.username });
  } catch (e) {
    res.status(401).send({ message: e.message });
  }
};

exports.search = async (req, res) => {
  try {
    const searchTerm = req.query.q.trim();
    const searchRegex = new RegExp(searchTerm, 'gi');

    // FIND all users WHERE _id !== req.userId AND
    // (fullName === searchTerm OR username === searchTerm)
    const users = await User.aggregate()
      .project({
        fullName: {
          $concat: ['$firstName', ' ', '$lastName']
        },
        username: 1
      })
      .match({
        $and: [
          {
            _id: {
              $ne: req.userId
            }
          },
          {
            $or: [
              {
                fullName: searchRegex
              },
              {
                username: searchRegex
              }
            ]
          }
        ]
      });
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

    const suggestedUsers = await User.find({
      _id: { $nin: followedUsers }
    }, 'username firstName lastName');
    res.status(200).send(suggestedUsers);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.follow = async (req, res) => {
  try {
    const followedUser = await User.findOne({ username: req.params.username }, '_id');
    const followingUser = await User.findOne({ _id: req.userId }, '_id');
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
    const followedUser = await User.findOne({ username: req.params.username }, '_id');
    const followingUser = await User.findOne({ _id: req.userId }, '_id');
    if (!followedUser || !followingUser) {
      throw new Error('User not found');
    }
    const unfollow = await Follow.findOne({
      followedUser,
      followingUser
    });
    unfollow.remove();
    res.status(204).send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};