const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');
const { usersGenerator, random } = require('../../../fake-data-generator');
const { USER_NOT_FOUND, USER_FOLLOWED, USER_CANT_FOLLOW } = require('../errors');

let app;

describe('Follow a user -> #POST /api/follow/:username', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Valid username and user isn\'t followed, expect to pass', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const { username } = user2;

    await request(app)
      .post(`/api/follow/${username}`)
      .set('Authorization', token)
      .expect(201);

    done();
  });

  it('Invalid username, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const invalidUsername = random.randomUsername();

    const res = await request(app)
      .post(`/api/follow/${invalidUsername}`)
      .set('Authorization', token)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(USER_NOT_FOUND);
    done();
  });

  it('Valid username and user is already followed, expect to fail', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const { username } = user2;
    await FollowsDAL.create(user2._id, user1._id);

    const res = await request(app)
      .post(`/api/follow/${username}`)
      .set('Authorization', token)
      .expect(403);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(USER_FOLLOWED);
    done();
  });

  it('User following him/herself, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const { username } = user;

    const res = await request(app)
      .post(`/api/follow/${username}`)
      .set('Authorization', token)
      .expect(403);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(USER_CANT_FOLLOW);
    done();
  });
});