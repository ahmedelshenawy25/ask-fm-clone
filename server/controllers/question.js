const User = require('../modules/users/users.model');
const Question = require('../models/question');
const Follow = require('../models/follow');

// remove sender info from anonymous questions
function removeAnonymousSenderInfo (questions) {
  return questions.map((question) => {
    question.sender = question.isAnonymous ? undefined : question.sender;
    return question;
  });
}

exports.getFriendsQuestions = async (req, res) => {
  try {
    const followedUser = await Follow.find({
      followingUser: req.userId
    },
    '-_id followedUser'
    );
    const followedUsersId = followedUser.map(userId => userId.followedUser);

    const questions = await Question.find(
      {
        answered: true,
        recipient: {
          $in: followedUsersId
        }
      },
      '-__v -createdAt'
    )
      .populate('recipient', '-_id firstName lastName username')
      .populate('sender', '-_id firstName lastName username')
      .sort('-updatedAt');

    const modifiedQuestions = removeAnonymousSenderInfo(questions);

    res.status(200).send(modifiedQuestions);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.getUnansweredQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      recipient: req.userId,
      answered: false
    }, 'sender question createdAt isAnonymous')
      .populate('sender', '-_id firstName lastName')
      .sort('-createdAt');
    const modifiedQuestions = removeAnonymousSenderInfo(questions);
    res.status(200).send(modifiedQuestions);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.getAnsweredQuestions = async (req, res) => {
  try {
    const recipient = await User.findOne({ username: req.params.username }, '_id');
    if (!recipient) {
      throw new Error('User not found.');
    }

    const questions = await Question.find({
      recipient,
      answered: true
    }, 'sender question answer updatedAt isAnonymous')
      .populate('sender', '-_id firstName lastName username')
      .sort('-updatedAt');

    const modifiedQuestions = removeAnonymousSenderInfo(questions);
    const followed = await Follow.findOne({
      followedUser: recipient,
      followingUser: req.userId
    });

    const isFollowed = !!followed;
    // could move that check to frontend if I send username
    const renderFollowButton = req.userId.toString() !== recipient._id.toString();
    res.status(200).send({ modifiedQuestions, isFollowed, renderFollowButton });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.askQuestion = async (req, res) => {
  const sender = req.userId;
  try {
    const recipient = await User.findOne({ username: req.params.username }, '_id');
    if (!recipient) {
      throw new Error('User not found.');
    }

    const ask = new Question({
      recipient: recipient._id,
      sender,
      question: req.body.question,
      isAnonymous: req.body.isAnonymous
    });
    await ask.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.params.questionId, {
      answer: req.body.answer,
      answered: true
    });
    res.status(204).send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      throw new Error('Question not found.');
    }

    await question.remove();
    res.status(204).send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};