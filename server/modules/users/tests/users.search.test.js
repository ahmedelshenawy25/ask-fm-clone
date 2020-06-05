const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('../usersDAL');

let app;
let user1;
let user2;
let user3;
let token;

describe('/search?q=', () => {
  beforeAll(() => {
    require('../../../init/init.env');
    require('../../../init/init.database');
    app = require('../../../init/init.app');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    user1 = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      username: 'johndoe',
      password: 'Abcdefg1!'
    };
    user2 = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      username: 'janedoe',
      password: 'Abcdefg1!'
    };
    user3 = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@smith.com',
      username: 'johnsmith',
      password: 'Abcdefg1!'
    };
    await UsersDAL.createUser(user1);
    await UsersDAL.createUser(user2);
    await UsersDAL.createUser(user3);
    token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('Search for users', () => {
    it('Valid query param, expect to pass', async (done) => {
      const searchTerm = 'j';

      const res = await request(app)
        .get('/api/search')
        .query({ q: searchTerm })
        .set('Authorization', token)
        .expect(200);

      res.body.forEach((user) => {
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('fullName');
        expect(user).toHaveProperty('isFollowed');
      });
      done();
    });

    it('No query param, expect to fail', async (done) => {
      await request(app)
        .get('/api/search')
        .set('Authorization', token)
        .expect(400);

      done();
    });
  });
});