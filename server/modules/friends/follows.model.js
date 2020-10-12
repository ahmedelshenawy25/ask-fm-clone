const mongoose = require('mongoose');
const { Schema } = mongoose;

const followSchema = new Schema(
  {
    followedUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    followingUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }
);

followSchema.index({ followedUser: 1, followingUser: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);