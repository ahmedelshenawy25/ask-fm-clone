const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const { usersGenerator } = require('../../../fake-data-generator');

let app;

describe('Get unfollowed users -> #GET /api/users/discover', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('User logged in, expect to get unfollowed users', async (done) => {
    const usersCount = 5;
    const [user1] = await usersGenerator(usersCount);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;

    const res = await request(app)
      .get('/api/users/discover')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('usersCount');
    res.body.users.forEach((user) => {
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
    });
    expect(res.body.users).toHaveLength(usersCount - 1);
    expect(res.body.usersCount).toEqual(usersCount - 1);
    done();
  });
});