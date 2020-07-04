const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
    recipient: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    question: { type: String, required: true, trim: true, minlength: 1, maxlength: 300 },
    answer: { type: String, trim: true, minlength: 1, maxlength: 3000 },
    answered: { type: Boolean, default: false },
    isAnonymous: { type: Boolean, default: false, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);