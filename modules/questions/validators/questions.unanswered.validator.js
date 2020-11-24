const joi = require('joi');

const querySchema = joi.object({
  page: joi.number()
    .positive()
    .default(1),
  limit: joi.number()
    .positive()
    .default(10)
});

module.exports = {
  querySchema
};