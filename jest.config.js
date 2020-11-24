module.exports = {
  testEnvironment: 'node',
  automock: false,
  moduleNameMapper: {
    '@UsersDAL': '<rootDir>/modules/users/usersDAL.js',
    '@QuestionsDAL': '<rootDir>/modules/questions/questionsDAL.js',
    '@FollowsDAL': '<rootDir>/modules/friends/followsDAL.js',
    '@validator': '<rootDir>/middleware/validator.js',
    '@helpers/(.*)': '<rootDir>/helpers/$1'
  }
};