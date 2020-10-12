const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');

let app;
let user;
let token;

describe('/account/inbox', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
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

  describe('Get unanswered questions for logged in user', () => {
    it('isAnonymous set to false, expect to pass and have property sender', async (done) => {
      await QuestionsDAL.createQuestion({
        sender: user._id,
        recipient: user._id,
        question: 'aaaa'
      });
      await QuestionsDAL.createQuestion({
        sender: user._id,
        recipient: user._id,
        question: 'bbbb'
      });

      const res = await request(app)
        .get('/api/account/inbox')
        .set('Authorization', token)
        .expect(200);

      res.body.forEach((question) => {
        expect(question).toHaveProperty('isAnonymous', false);
        expect(question).toHaveProperty('_id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('createdAt');
        expect(question).toHaveProperty('sender');
      });
      done();
    });

    it('isAnonymous set to true, expect to pass and not have property sender', async (done) => {
      await QuestionsDAL.createQuestion({
        sender: user._id,
        recipient: user._id,
        question: 'aaaa',
        isAnonymous: true
      });
      await QuestionsDAL.createQuestion({
        sender: user._id,
        recipient: user._id,
        question: 'bbbb',
        isAnonymous: true
      });

      const res = await request(app)
        .get('/api/account/inbox')
        .set('Authorization', token)
        .expect(200);

      res.body.forEach((question) => {
        expect(question).toHaveProperty('isAnonymous', true);
        expect(question).toHaveProperty('_id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('createdAt');
        expect(question).not.toHaveProperty('sender');
      });
      done();
    });
  });
});