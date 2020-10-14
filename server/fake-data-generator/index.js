const usersGenerator = require('./users.generator');
const questionsGenerator = require('./questions.generator');

module.exports = {
  usersGenerator: usersGenerator.usersGenerator,
  questionsGenerator: questionsGenerator.questionsGenerator,
  random: {
    randomFirstName: usersGenerator.randomFirstName,
    randomLastName: usersGenerator.randomLastName,
    randomEmail: usersGenerator.randomEmail,
    randomUsername: usersGenerator.randomUsername,
    randomPassword: usersGenerator.randomPassword,
    randomText: questionsGenerator.randomText
  }
};