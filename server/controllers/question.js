const User = require('../models/user');
const Question = require('../models/question');
const Follow = require('../models/follow');

// remove sender info from anonymous questions
const removeAnonymousSenderInfo = questions => questions.map((question) => {
    if (question.isAnonymous) {
        question.sender = undefined;
        return question;
    }
    return question;
});

exports.getFriendsQuestions = async (req, res) => {
    try {
        const followedUser = await Follow.find({
            followingUser: req.userId
        },
        '-_id followedUser');
        const followedUsersId = followedUser.map(userId => userId.followedUser);
        if (!followedUser) {
            throw new Error('Could not find followed users');
        }
        const questions = await Question.find({
            answered: true,
            recipient: {
                $in: followedUsersId
            }
        })
            .populate('recipient', '-_id firstName lastName username')
            .populate('sender', '-_id firstName lastName username')
            .sort('-updatedAt');

        if (!questions) {
            throw new Error('Could not find questions');
        }
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
        if (!questions) {
            throw new Error('Questions not found.');
        }
        const modifiedQuestions = removeAnonymousSenderInfo(questions);
        const followed = await Follow.findOne({
            followedUser: recipient,
            followingUser: req.userId
        });

        const isFollowed = !!followed;
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

        question.remove();
        res.status(204).send();
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
};
