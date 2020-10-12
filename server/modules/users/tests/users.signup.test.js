const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');

let app;

describe('/signup', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('Create a new user', () => {
    it('User doesn\'t exist, expect to pass', async (done) => {
      const user = {
        _id: mongoose.Types.ObjectId(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        username: 'johndoe',
        password: 'Abcdefg1!'
      };

      await request(app)
        .post('/api/signup')
        .send(user)
        .expect(201);

      done();
    });

    it('User exists, expect to fail', async (done) => {
      const user = {
        _id: mongoose.Types.ObjectId(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        username: 'johndoe',
        password: 'Abcdefg1!'
      };
      await UsersDAL.createUser(user);

      const res = await request(app)
        .post('/api/signup')
        .send(user)
        .expect(400);

      expect(res.body).toHaveProperty('message');
      done();
    });
  });
});