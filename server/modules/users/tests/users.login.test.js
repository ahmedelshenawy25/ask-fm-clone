const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('../usersDAL');

let app;
let user;

describe('/login', () => {
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
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('Log user in', () => {
    it('Valid login input, expect to pass', async (done) => {
      const validLoginData = {
        usernameOrEmail: 'johndoe',
        password: 'Abcdefg1!'
      };

      const res = await request(app)
        .post('/api/login')
        .send(validLoginData)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('username', user.username);
      done();
    });

    it('Invalid login input, expect to fail', async (done) => {
      const invalidLoginData = {
        username: 'aaaaa',
        password: 'Abcdefg1!'
      };

      const res = await request(app)
        .post('/api/login')
        .send(invalidLoginData)
        .expect(401);

      expect(res.body).toHaveProperty('message');
      done();
    });
  });
});