const User = require('../models/user');
const Question = require('../models/question');
const userData = require('./user.json');
const questionData = require('./question.json');

// Inserts dummy data for development
async function insertDummyData () {
  try {
    const userCount = await User.estimatedDocumentCount();
    if (userCount < 5) {
      User.create(userData);
    }
    const questionCount = await Question.estimatedDocumentCount();
    if (questionCount < 10) {
      Question.create(questionData);
    }
  } catch (e) {
    console.log('Failed to create documents\n', e);
  }
}

module.exports = insertDummyData;