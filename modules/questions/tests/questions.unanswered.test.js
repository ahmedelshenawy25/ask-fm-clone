const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const { usersGenerator, questionsGenerator } = require('../../../fake-data-generator');

let app;

describe('Get unanswered questions for logged in user -> #GET /api/questions/unanswered', () => {
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
      .get('/api/questions/unanswered')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('questions');
    expect(res.body).toHaveProperty('questionsCount');
    expect(res.body.questions).toHaveLength(questionsCount);
    res.body.questions.forEach((question) => {
      expect(question).toHaveProperty('isAnonymous', false);
      expect(question).toHaveProperty('_id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('createdAt');
      expect(question).toHaveProperty('sender');
    });
    expect(res.body.questionsCount).toEqual(questionsCount);
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
      .get('/api/questions/unanswered')
      .set('Authorization', token)
      .expect(200);

    expect(res.body).toHaveProperty('questions');
    expect(res.body).toHaveProperty('questionsCount');
    expect(res.body.questions).toHaveLength(questionsCount);
    res.body.questions.forEach((question) => {
      expect(question).toHaveProperty('isAnonymous', true);
      expect(question).toHaveProperty('_id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('createdAt');
      expect(question).not.toHaveProperty('sender');
    });
    expect(res.body.questionsCount).toEqual(questionsCount);
    done();
  });

  it('No questions, expect to get an empty array', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;

    const res = await request(app)
      .get('/api/questions/unanswered')
      .set('Authorization', token)
      .expect(200);

    expect(res.body.questions).toHaveLength(0);
    expect(res.body.questionsCount).toEqual(0);
    done();
  });
});