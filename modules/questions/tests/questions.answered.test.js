const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');
const { usersGenerator, questionsGenerator, random } = require('../../../fake-data-generator');
const { USER_NOT_FOUND } = require('../errors');

let app;

describe('Get answered questions for a user by username -> #GET /api/user/:username', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Valid username and isAnonymous set to false, expect to pass and have property sender', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const { username } = user2;
    await questionsGenerator({
      senderId: user1._id,
      recipientId: user2._id,
      isAnswered: true,
      isAnonymous: false,
      questionsCount: 1
    });
    await questionsGenerator({
      senderId: user2._id,
      recipientId: user2._id,
      isAnswered: true,
      isAnonymous: false,
      questionsCount: 1
    });
    await FollowsDAL.create(user2._id, user1._id);

    const res = await request(app)
      .get(`/api/user/${username}`)
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('isFollowed');
    expect(res.body).toHaveProperty('questions');
    expect(res.body).toHaveProperty('questionsCount');
    expect(res.body.isFollowed).toBeTruthy();
    res.body.questions.forEach((question) => {
      expect(question).toHaveProperty('isAnonymous', false);
      expect(question).toHaveProperty('_id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('answer');
      expect(question).toHaveProperty('updatedAt');
      expect(question).toHaveProperty('sender');
    });
    expect(res.body.questionsCount).toBeGreaterThanOrEqual(0);
    done();
  });

  it('Valid username and isAnonymous set to true, expect to pass and not have property sender', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const { username } = user1;
    await questionsGenerator({
      senderId: user2._id,
      recipientId: user1._id,
      isAnswered: true,
      isAnonymous: true,
      questionsCount: 1
    });
    await questionsGenerator({
      senderId: user1._id,
      recipientId: user1._id,
      isAnswered: true,
      isAnonymous: true,
      questionsCount: 1
    });

    const res = await request(app)
      .get(`/api/user/${username}`)
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('isFollowed');
    expect(res.body).toHaveProperty('questions');
    expect(res.body).toHaveProperty('questionsCount');
    res.body.questions.forEach((question) => {
      expect(question).toHaveProperty('isAnonymous', true);
      expect(question).toHaveProperty('_id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('answer');
      expect(question).toHaveProperty('updatedAt');
      expect(question).not.toHaveProperty('sender');
    });
    expect(res.body.questionsCount).toBeGreaterThanOrEqual(0);
    done();
  });

  it('Valid username and no answered questions, expect to get an empty array', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const { username } = user2;
    await questionsGenerator({
      senderId: user2._id,
      recipientId: user2._id,
      isAnswered: false,
      isAnonymous: true,
      questionsCount: 1
    });

    const res = await request(app)
      .get(`/api/user/${username}`)
      .set('Authorization', token)
      .expect(200);

    expect(res.body.isFollowed).toBeFalsy();
    expect(res.body.questions).toHaveLength(0);
    expect(res.body.questionsCount).toEqual(0);
    done();
  });

  it('Invalid username, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const invalidUsername = random.randomUsername();

    const res = await request(app)
      .get(`/api/user/${invalidUsername}`)
      .set('Authorization', token)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(USER_NOT_FOUND);
    done();
  });
});