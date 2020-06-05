const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('../../users/usersDAL');
const Question = require('../../../models/question');

let app;
let user;
let token;

describe('/delete/:questionId', () => {
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

  describe('Delete a question', () => {
    it('Valid questionId, expect to pass', async (done) => {
      const question = await Question.create({
        _id: mongoose.Types.ObjectId(),
        sender: user._id,
        recipient: user._id,
        question: 'aaaa'
      });
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