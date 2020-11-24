const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');
const { usersGenerator } = require('../../../fake-data-generator');

let app;

describe('Get followed users -> #GET /api/friends', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('User following other users, expect to get these users', async (done) => {
    const [user1, user2, user3] = await usersGenerator(3);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    await FollowsDAL.create(user2._id, user1._id);
    await FollowsDAL.create(user3._id, user1._id);

    const res = await request(app)
      .get('/api/friends')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('usersCount');
    res.body.users.forEach((user) => {
      expect(user).toHaveProperty('followedUser');
      expect(user.followedUser).toHaveProperty('_id');
      expect(user.followedUser).toHaveProperty('username');
      expect(user.followedUser).toHaveProperty('firstName');
      expect(user.followedUser).toHaveProperty('lastName');
    });
    expect(res.body.users.length).toBeGreaterThan(0);
    expect(res.body.usersCount).toBeGreaterThan(0);
    done();
  });

  it('User not following any user, expect to get an empty array', async (done) => {
    const user1 = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;

    const res = await request(app)
      .get('/api/friends')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('usersCount');
    expect(res.body.users).toHaveLength(0);
    expect(res.body.usersCount).toEqual(0);
    done();
  });
});