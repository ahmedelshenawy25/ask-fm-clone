const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const { random } = require('../../../fake-data-generator');

let app;
let user1;
let user2;
let user3;
let token;

// TODO: modify test cases
describe('Search for users -> #GET /api/search', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    user1 = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'John',
      lastName: 'Doe',
      email: random.randomEmail(),
      username: 'johndoe',
      password: random.randomPassword()
    };
    user2 = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'Jane',
      lastName: 'Doe',
      email: random.randomEmail(),
      username: 'janedoe',
      password: random.randomPassword()
    };
    user3 = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'John',
      lastName: 'Smith',
      email: random.randomEmail(),
      username: 'johnsmith',
      password: random.randomPassword()
    };
    await UsersDAL.createUser(user1);
    await UsersDAL.createUser(user2);
    await UsersDAL.createUser(user3);
    token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });
  it('Valid query param, expect to pass', async (done) => {
    const searchTerm = 'j';

    const res = await request(app)
      .get('/api/search')
      .query({
        q: searchTerm,
        page: 1,
        limit: 10
      })
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('usersCount');
    res.body.users.forEach((user) => {
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('fullName');
      expect(user).toHaveProperty('isFollowed');
    });
    expect(res.body.usersCount).toBeGreaterThanOrEqual(0);
    done();
  });

  it('doesn\'t return currently logged in user', async (done) => {
    const searchTerm = 'j';

    const res = await request(app)
      .get('/api/search')
      .query({
        q: searchTerm,
        page: 1,
        limit: 10
      })
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('usersCount');
    res.body.users.forEach(({ username }) => {
      expect(username).not.toEqual(user1.username);
    });
    expect(res.body.usersCount).toBeGreaterThanOrEqual(0);
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