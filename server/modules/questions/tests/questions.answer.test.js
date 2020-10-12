const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');

let app;
let user;
let token;

describe('/answer/:questionId', () => {
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

  describe('Answer a question', () => {
    it('Valid questionId and input, expect to pass', async (done) => {
      const question = {
        _id: mongoose.Types.ObjectId(),
        sender: user._id,
        recipient: user._id,
        question: 'aaaa'
      };
      await QuestionsDAL.createQuestion(question);
      const questionId = question._id;
      const answer = {
        answer: 'aaaaaa'
      };

      await request(app)
        .put(`/api/answer/${questionId}`)
        .set('Authorization', token)
        .send(answer)
        .expect(204);

      done();
    });

    it('Invalid questionId, expect to fail', async (done) => {
      const invalidQuestionId = 'zzzzzzzzzzz';
      const answer = 'aaaaaa';

      await request(app)
        .put(`/api/answer/${invalidQuestionId}`)
        .set('Authorization', token)
        .send(answer)
        .expect(400);

      done();
    });
  });
});