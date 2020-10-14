const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');
const { usersGenerator, questionsGenerator } = require('../../../fake-data-generator');

let app;

describe('Get all answered questions by followed users -> #GET /api/home', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('isAnonymous set to false, expect to pass and have property sender', async (done) => {
    const [user1, user2, user3] = await usersGenerator(3);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    await questionsGenerator({
      senderId: user2._id,
      recipientId: user2._id,
      isAnswered: true,
      isAnonymous: false,
      questionsCount: 1
    });
    await questionsGenerator({
      senderId: user3._id,
      recipientId: user3._id,
      isAnswered: true,
      isAnonymous: false,
      questionsCount: 1
    });
    await questionsGenerator({
      senderId: user3._id,
      recipientId: user1._id,
      isAnswered: true,
      isAnonymous: false,
      questionsCount: 1
    });
    await FollowsDAL.create(user2._id, user1._id);
    await FollowsDAL.create(user3._id, user1._id);

    const res = await request(app)
      .get('/api/home')
      .set('Authorization', token)
      .expect(200);

    res.body.forEach((question) => {
      expect(question).toHaveProperty('isAnonymous', false);
      expect(question).toHaveProperty('_id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('answer');
      expect(question).toHaveProperty('updatedAt');
      expect(question).toHaveProperty('sender');
      expect(question).toHaveProperty('recipient');
      expect(question).toHaveProperty('answered');
      expect(question.recipient.username).not.toEqual(user1.username);
    });
    done();
  });

  it('isAnonymous set to true, expect to pass and not have property sender', async (done) => {
    const [user1, user2, user3] = await usersGenerator(3);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    await questionsGenerator({
      senderId: user2._id,
      recipientId: user2._id,
      isAnswered: true,
      isAnonymous: true,
      questionsCount: 1
    });
    await questionsGenerator({
      senderId: user3._id,
      recipientId: user3._id,
      isAnswered: true,
      isAnonymous: true,
      questionsCount: 1
    });
    await questionsGenerator({
      senderId: user3._id,
      recipientId: user1._id,
      isAnswered: true,
      isAnonymous: true,
      questionsCount: 1
    });
    await FollowsDAL.create(user2._id, user1._id);
    await FollowsDAL.create(user3._id, user1._id);

    const res = await request(app)
      .get('/api/home')
      .set('Authorization', token)
      .expect(200);

    res.body.forEach((question) => {
      expect(question).toHaveProperty('isAnonymous', true);
      expect(question).toHaveProperty('_id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('answer');
      expect(question).toHaveProperty('updatedAt');
      expect(question).not.toHaveProperty('sender');
      expect(question).toHaveProperty('recipient');
      expect(question).toHaveProperty('answered');
    });
    done();
  });

  it('No answered questions, expect to get an empty array', async (done) => {
    const [user1, user2, user3] = await usersGenerator(3);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    await questionsGenerator({
      senderId: user2._id,
      recipientId: user2._id,
      isAnswered: false,
      isAnonymous: true,
      questionsCount: 1
    });
    await questionsGenerator({
      senderId: user3._id,
      recipientId: user3._id,
      isAnswered: false,
      isAnonymous: false,
      questionsCount: 1
    });
    await FollowsDAL.create(user2._id, user1._id);
    await FollowsDAL.create(user3._id, user1._id);

    const res = await request(app)
      .get('/api/home')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveLength(0);
    done();
  });
});