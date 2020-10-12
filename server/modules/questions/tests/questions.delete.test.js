const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const QuestionsDAL = require('@QuestionsDAL');

let app;
let user;
let token;

describe('/delete/:questionId', () => {
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

  describe('Delete a question', () => {
    it('Valid questionId, expect to pass', async (done) => {
      const question = {
        _id: mongoose.Types.ObjectId(),
        sender: user._id,
        recipient: user._id,
        question: 'aaaa'
      };
      await QuestionsDAL.createQuestion(question);
      const questionId = question._id;


      await request(app)
        .delete(`/api/delete/${questionId}`)
        .set('Authorization', token)
        .expect(204);

      done();
    });

    it('Invalid questionId, expect to fail', async (done) => {
      const invalidQuestionId = 'zzzzzzzzzzz';

      await request(app)
        .delete(`/api/delete/${invalidQuestionId}`)
        .set('Authorization', token)
        .expect(400);

      done();
    });
  });
});