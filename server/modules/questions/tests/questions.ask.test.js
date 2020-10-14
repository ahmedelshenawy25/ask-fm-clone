const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const { usersGenerator, random } = require('../../../fake-data-generator');

let app;

describe('Ask a question -> #POST /api/:username/ask', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('User asks another user, expect to pass', async (done) => {
    const [user1, user2] = await usersGenerator(2);
    const token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
    const question = {
      question: random.randomText(300),
      isAnonymous: true
    };
    const { username } = user2;

    await request(app)
      .post(`/api/${username}/ask`)
      .set('Authorization', token)
      .send(question)
      .expect(201);

    done();
  });

  it('User asks him/herself, expect to pass', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const question = {
      question: random.randomText(300),
      isAnonymous: false
    };
    const { username } = user;

    await request(app)
      .post(`/api/${username}/ask`)
      .set('Authorization', token)
      .send(question)
      .expect(201);

    done();
  });

  it('Invalid username, expect to fail', async (done) => {
    const user = await usersGenerator();
    const token = `Bearer ${UsersDAL.generateAuthToken(user)}`;
    const question = {
      question: random.randomText(300),
      isAnonymous: true
    };
    const invalidUsername = random.randomUsername();

    await request(app)
      .post(`/api/${invalidUsername}/ask`)
      .set('Authorization', token)
      .send(question)
      .expect(400);

    done();
  });
});