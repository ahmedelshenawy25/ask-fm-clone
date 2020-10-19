const mongoose = require('mongoose');
const request = require('supertest');
const { usersGenerator, random } = require('../../../fake-data-generator');

let app;

describe('Create a new user -> #POST /api/signup', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('User doesn\'t exist, expect to pass', async (done) => {
    const user = {
      firstName: random.randomFirstName(),
      lastName: random.randomLastName(),
      email: random.randomEmail(),
      username: random.randomUsername(),
      password: random.randomPassword()
    };

    await request(app)
      .post('/api/signup')
      .send(user)
      .expect(201);

    done();
  });

  it('Username exists, expect to fail', async (done) => {
    const user1 = await usersGenerator();
    const user2 = {
      firstName: random.randomFirstName(),
      lastName: random.randomLastName(),
      email: random.randomEmail(),
      username: user1.username,
      password: random.randomPassword()
    };

    const res = await request(app)
      .post('/api/signup')
      .send(user2)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    done();
  });

  it('Email exists, expect to fail', async (done) => {
    const user1 = await usersGenerator();
    const user2 = {
      firstName: random.randomFirstName(),
      lastName: random.randomLastName(),
      email: user1.email,
      username: random.randomUsername(),
      password: random.randomPassword()
    };

    const res = await request(app)
      .post('/api/signup')
      .send(user2)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    done();
  });
});