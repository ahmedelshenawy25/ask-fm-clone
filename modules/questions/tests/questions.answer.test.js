const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const { usersGenerator, questionsGenerator, random } = require('../../../fake-data-generator');
const { QUESTION_NOT_FOUND, INVALID_QUESTION_ID, ANSWER_LENGTH } = require('../errors');

let app;
// TODO: check if you can answer an already answered question
describe('Answer a question -> #PUT /api/answer/:questionId', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Valid questionId and input, expect to pass', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const question = await questionsGenerator({
      senderId: user._id,
      recipientId: user._id,
      isAnswered: false,
      isAnonymous: true,
      questionsCount: 1
    });
    const questionId = question._id;
    const answer = {
      answer: random.randomText(3000)
    };

    await request(app)
      .put(`/api/answer/${questionId}`)
      .set('Authorization', token)
      .send(answer)
      .expect(204);

    done();
  });

  it('Answer exceeds max length, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const question = await questionsGenerator({
      senderId: user._id,
      recipientId: user._id,
      isAnswered: false,
      isAnonymous: true,
      questionsCount: 1
    });
    const questionId = question._id;
    const answer = {
      answer: 'a'.repeat(3001)
    };

    const res = await request(app)
      .put(`/api/answer/${questionId}`)
      .set('Authorization', token)
      .send(answer)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(ANSWER_LENGTH);
    done();
  });

  it('Answer under min length, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const question = await questionsGenerator({
      senderId: user._id,
      recipientId: user._id,
      isAnswered: false,
      isAnonymous: true,
      questionsCount: 1
    });
    const questionId = question._id;
    const answer = {
      answer: ''
    };

    const res = await request(app)
      .put(`/api/answer/${questionId}`)
      .set('Authorization', token)
      .send(answer)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(ANSWER_LENGTH);
    done();
  });

  it('Valid questionId and another user tries to answer the question, expect to fail', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const question = await questionsGenerator({
      senderId: user1._id,
      recipientId: user2._id,
      isAnswered: false,
      isAnonymous: false,
      questionsCount: 1
    });
    const questionId = question._id;
    const answer = {
      answer: random.randomText(3000)
    };

    const res = await request(app)
      .put(`/api/answer/${questionId}`)
      .set('Authorization', token)
      .send(answer)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(QUESTION_NOT_FOUND);
    done();
  });

  it('Valid mongooseId but question doesn\'t exist, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const invalidQuestionId = mongoose.Types.ObjectId();
    const answer = {
      answer: random.randomText(3000)
    };

    const res = await request(app)
      .put(`/api/answer/${invalidQuestionId}`)
      .set('Authorization', token)
      .send(answer)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(QUESTION_NOT_FOUND);
    done();
  });

  it('Invalid questionId, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const invalidQuestionId = random.randomText(12);
    const answer = {
      answer: random.randomText(3000)
    };

    const res = await request(app)
      .put(`/api/answer/${invalidQuestionId}`)
      .set('Authorization', token)
      .send(answer)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(INVALID_QUESTION_ID);
    done();
  });
});