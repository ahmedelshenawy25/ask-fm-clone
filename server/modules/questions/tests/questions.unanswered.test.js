const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const { usersGenerator, questionsGenerator } = require('../../../fake-data-generator');

let app;

describe('Get unanswered questions for logged in user -> #GET /api/account/inbox', () => {
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
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const questionsCount = 10;
    await questionsGenerator({
      senderId: user._id,
      recipientId: user._id,
      isAnswered: false,
      isAnonymous: false,
      questionsCount
    });

    const res = await request(app)
      .get('/api/account/inbox')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveLength(questionsCount);
    res.body.forEach((question) => {
      expect(question).toHaveProperty('isAnonymous', false);
      expect(question).toHaveProperty('_id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('createdAt');
      expect(question).toHaveProperty('sender');
    });
    done();
  });

  it('isAnonymous set to true, expect to pass and not have property sender', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const questionsCount = 10;
    await questionsGenerator({
      senderId: user._id,
      recipientId: user._id,
      isAnswered: false,
      isAnonymous: true,
      questionsCount
    });

    const res = await request(app)
      .get('/api/account/inbox')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveLength(questionsCount);
    res.body.forEach((question) => {
      expect(question).toHaveProperty('isAnonymous', true);
      expect(question).toHaveProperty('_id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('createdAt');
      expect(question).not.toHaveProperty('sender');
    });
    done();
  });

  it('No questions, expect to get an empty array', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;

    const res = await request(app)
      .get('/api/account/inbox')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveLength(0);
    done();
  });
});