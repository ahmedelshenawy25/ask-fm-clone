const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const { usersGenerator, questionsGenerator, random } = require('../../../fake-data-generator');
const { QUESTION_NOT_FOUND, INVALID_QUESTION_ID } = require('../errors');

let app;

describe('Delete a question -> #DELETE /api/questions/:questionId', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Valid questionId, expect to pass', async (done) => {
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

    await request(app)
      .delete(`/api/questions/${questionId}`)
      .set('Authorization', token)
      .expect(204);

    done();
  });

  it('Valid questionId and another user tries to delete the question, expect to fail', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const question = await questionsGenerator({
      senderId: user1._id,
      recipientId: user2._id,
      isAnswered: false,
      isAnonymous: true,
      questionsCount: 1
    });
    const questionId = question._id;

    const res = await request(app)
      .delete(`/api/questions/${questionId}`)
      .set('Authorization', token)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(QUESTION_NOT_FOUND);
    done();
  });

  it('Valid mongooseId but question doesn\'t exist, expect to fail', async (done) => {
    const invalidQuestionId = mongoose.Types.ObjectId();
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;

    const res = await request(app)
      .delete(`/api/questions/${invalidQuestionId}`)
      .set('Authorization', token)
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(QUESTION_NOT_FOUND);
    done();
  });

  it('Invalid questionId, expect to fail', async (done) => {
    const invalidQuestionId = random.randomText(12);
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;

    const res = await request(app)
      .delete(`/api/questions/${invalidQuestionId}`)
      .set('Authorization', token)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(INVALID_QUESTION_ID);
    done();
  });
});