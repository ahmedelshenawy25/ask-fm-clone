module.exports = {
  testEnvironment: 'node',
  automock: false,
  moduleNameMapper: {
    '@UsersDAL': '<rootDir>/modules/users/usersDAL.js',
    '@QuestionsDAL': '<rootDir>/modules/questions/questionsDAL.js',
    '@FollowsDAL': '<rootDir>/modules/users/followsDAL.js'
  }
};