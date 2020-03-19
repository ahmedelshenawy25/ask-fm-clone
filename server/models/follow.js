const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    followedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    followingUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

followSchema.index({ followedUser: 1, followingUser: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);