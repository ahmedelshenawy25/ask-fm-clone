const joi = require('joi');
const objectId = require('./objectId.extension');

module.exports = joi.extend(objectId);