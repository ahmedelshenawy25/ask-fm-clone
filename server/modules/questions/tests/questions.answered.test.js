const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');

let app;
let user;
let token;

describe('/user/:username', () => {
  beforeAll(() => {
    require('../../../init/init.env');
    require('../../../init/init.database');
    app = require('../../../init/init.app');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    user = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      username: 'johndoe',
      password: 'Abcdefg1!'
    };
    await UsersDAL.createUser(user);
    token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('Get answered questions for a user by username', () => {
    it('Valid username and isAnonymous set to false, expect to pass and have property sender', async (done) => {
      const { username } = user;
      await QuestionsDAL.createQuestion({
        sender: user._id,
        recipient: user._id,
        question: 'aaaa',
        answered: true,
        answer: 'aaaa'
      });
      await QuestionsDAL.createQuestion({
        sender: user._id,
        recipient: user._id,
        question: 'bbbb',
        answered: true,
        answer: 'bbbb'
      });

      const res = await request(app)
        .get(`/api/user/${username}`)
        .set('Authorization', token)
        .expect(200);

      expect(res.body).toHaveProperty('isFollowed');
      expect(res.body).toHaveProperty('renderFollowButton');
      expect(res.body).toHaveProperty('modifiedQuestions');
      res.body.modifiedQuestions.forEach((question) => {
        expect(question).toHaveProperty('isAnonymous', false);
        expect(question).toHaveProperty('_id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('answer');
        expect(question).toHaveProperty('updatedAt');
        expect(question).toHaveProperty('sender');
      });
      done();
    });

    it('Valid username and isAnonymous set to true, expect to pass and not have property sender', async (done) => {
      const { username } = user;
      await QuestionsDAL.createQuestion({
        sender: user._id,
        recipient: user._id,
        question: 'aaaa',
        answered: true,
        answer: 'aaaa',
        isAnonymous: true
      });
      await QuestionsDAL.createQuestion({
        sender: user._id,
        recipient: user._id,
        question: 'bbbb',
        answered: true,
        answer: 'bbbb',
        isAnonymous: true
      });

      const res = await request(app)
        .get(`/api/user/${username}`)
        .set('Authorization', token)
        .expect(200);

      expect(res.body).toHaveProperty('isFollowed');
      expect(res.body).toHaveProperty('renderFollowButton');
      expect(res.body).toHaveProperty('modifiedQuestions');
      res.body.modifiedQuestions.forEach((question) => {
        expect(question).toHaveProperty('isAnonymous', true);
        expect(question).toHaveProperty('_id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('answer');
        expect(question).toHaveProperty('updatedAt');
        expect(question).not.toHaveProperty('sender');
      });
      done();
    });

    it('Invalid username, expect to fail', async (done) => {
      const invalidUsername = 'invalidUsername';

      await request(app)
        .get(`/api/user/${invalidUsername}`)
        .set('Authorization', token)
        .expect(400);

      done();
    });
  });

});