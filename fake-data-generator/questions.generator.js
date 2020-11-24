const faker = require('faker');
const QuestionsDAL = require('@QuestionsDAL');
const mongoose = require('mongoose');

async function questionsGenerator ({ senderId, recipientId, questionsCount = 1, isAnonymous, isAnswered }) {
  const questions = [];

  for (let i = 0; i < questionsCount; i++) {
    const question = {
      _id: mongoose.Types.ObjectId(),
      sender: senderId,
      recipient: recipientId,
      question: randomText(300),
      answered: isAnswered,
      isAnonymous
    };
    if (isAnswered) question.answer = randomText(3000);

    await QuestionsDAL.create(question);
    questions.push(question);
  }

  return questionsCount === 1 ? questions[0] : questions;
}

function randomText (maxChars) {
  const textLength = faker.random.number({ min: 1, max: maxChars });
  const text = faker.random.alphaNumeric(textLength);
  return text;
}
module.exports = {
  questionsGenerator,
  randomText
};