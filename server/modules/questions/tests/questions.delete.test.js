const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const { usersGenerator, questionsGenerator } = require('../../../fake-data-generator');

let app;

describe('Delete a question -> #DELETE /api/delete/:questionId', () => {
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
      .delete(`/api/delete/${questionId}`)
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

    await request(app)
      .delete(`/api/delete/${questionId}`)
      .set('Authorization', token)
      .expect(400);

    done();
  });

  it('Invalid questionId, expect to fail', async (done) => {
    const invalidQuestionId = mongoose.Types.ObjectId();
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;

    await request(app)
      .delete(`/api/delete/${invalidQuestionId}`)
      .set('Authorization', token)
      .expect(400);

    done();
  });
});