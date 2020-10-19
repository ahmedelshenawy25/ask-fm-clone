const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./users.model');

class UsersDAL {
  async createUser (userSignupForm) {
    const hashedPassword = await bcrypt.hash(userSignupForm.password, 10);
    userSignupForm = { ...userSignupForm, password: hashedPassword };
    await User.create(userSignupForm);
  }

  async findUserByEmail (email) {
    const user = await User.findOne({ email }, { _id: 1 });
    return user;
  }

  async findUserIdByUsername (username) {
    const user = await User.findOne({ username }, { _id: 1 });
    return user;
  }

  async findUserIdByUsernameOrEmail (username, email) {
    const user = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    });
    return user;
  }

  async findUserById (_id) {
    const user = await User.findOne({ _id }, { _id: 1 });
    return user;
  }

  async login (usernameOrEmail, password) {
    const user = await User.findOne({
      $or: [
        { email: usernameOrEmail },
        { username: usernameOrEmail }
      ]
    });
    const isValidPassword = user ? await bcrypt.compare(password, user.password) : false;
    return isValidPassword ? user : null;
  }

  generateAuthToken (user) {
    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '7d' });
    return token;
  }

  async findUsersByFullnameOrUsernameRegEx ({ searchQueryRegex, currentUserId, skip, limit }) {
    const users = await User.aggregate([
      {
        $project: {
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
          username: 1
        }
      },
      {
        $match: {
          _id: { $ne: mongoose.Types.ObjectId(currentUserId) },
          $or: [{ fullName: searchQueryRegex }, { username: searchQueryRegex }]
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);
    return users;
  }

  async findUsersCountByFullnameOrUsernameRegEx ({ searchQueryRegex, currentUserId }) {
    const usersCount = await User.aggregate([
      {
        $project: {
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
          username: 1
        }
      },
      {
        $match: {
          _id: { $ne: mongoose.Types.ObjectId(currentUserId) },
          $or: [{ fullName: searchQueryRegex }, { username: searchQueryRegex }]
        }
      },
      {
        $count: 'usersCount'
      }
    ]);

    return usersCount.length === 0 ? 0 : usersCount[0].usersCount;
  }

  async suggestUnfollowedUsers (followedUsersIds) {
    const suggestedUsers = await User.find({
      _id: { $nin: followedUsersIds }
    },
    { username: 1, firstName: 1, lastName: 1 }
    );
    return suggestedUsers;
  }
}

module.exports = new UsersDAL();