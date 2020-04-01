const User = require('./users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  async findUserByUsername (username) {
    const user = await User.findOne({ username }, { _id: 1 });
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

  async findUsersByFullnameOrUsernameRegEx (searchQueryRegex, currentUserId) {
    const users = await User.aggregate([
      {
        $project: {
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
          username: 1
        }
      },
      {
        $match: {
          _id: { $ne: currentUserId },
          $or: [{ fullName: searchQueryRegex }, { username: searchQueryRegex }]
        }
      }
    ]);
    return users;
  }

  async suggestUnfollowedUsers (followedUsersIds) {
    const suggestedUsers = await User.find({ _id: { $nin: followedUsersIds } }, { username: 1, firstName: 1, lastName: 1 });
    return suggestedUsers;
  }
}

module.exports = new UsersDAL();