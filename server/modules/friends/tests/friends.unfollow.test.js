const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');
const { usersGenerator, random } = require('../../../fake-data-generator');

let app;

describe('Unfollow a user -> #DELETE /api/unfollow/:username', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Valid username and user is followed, expect to pass', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const { username } = user2;
    await FollowsDAL.create(user2._id, user1._id);

    await request(app)
      .delete(`/api/unfollow/${username}`)
      .set('Authorization', token)
      .expect(204);

    done();
  });
  it('Invalid username, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const invalidUsername = random.randomUsername();

    await request(app)
      .delete(`/api/unfollow/${invalidUsername}`)
      .set('Authorization', token)
      .expect(400);

    done();
  });

  it('Valid username and user isn\'t followed, expect to fail', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const { username } = user2;

    await request(app)
      .delete(`/api/unfollow/${username}`)
      .set('Authorization', token)
      .expect(400);

    done();
  });
});