const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('../../users/usersDAL');

let app;
let user;
let token;

describe('/question/ask', () => {
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