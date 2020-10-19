const mongoose = require('mongoose');

module.exports = {
  type: 'objectId',
  messages: {
    invalid: 'needs to be a string of 12 bytes or a string of 24 hex characters'
  },
  validate (value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error('invalid') };
    }
  }
};