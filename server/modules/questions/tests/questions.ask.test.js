const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');

let app;
let user;
let token;

describe('/question/ask', () => {
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

  describe('Ask a question', () => {
    it('Valid username and input, expect to pass', async (done) => {
      const question = {
        question: 'aaaaaa',
        isAnonymous: true
      };
      const { username } = user;

      await request(app)
        .post(`/api/${username}/ask`)
        .set('Authorization', token)
        .send(question)
        .expect(201);

      done();
    });

    it('Invalid username, expect to fail', async (done) => {
      const question = {
        question: 'aaaaaa',
        isAnonymous: true
      };
      const invalidUsername = 'zzzzzzzzzzzzzzz';

      await request(app)
        .post(`/api/${invalidUsername}/ask`)
        .set('Authorization', token)
        .send(question)
        .expect(400);

      done();
    });
  });
});