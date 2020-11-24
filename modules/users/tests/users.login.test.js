const mongoose = require('mongoose');
const request = require('supertest');
const { usersGenerator, random } = require('../../../fake-data-generator');
const { INVALID_USERNAME_OR_PASSWORD } = require('../errors');

let app;

describe('Log user in -> #POST /api/login', () => {
  beforeAll(() => {
    app = require('../../../init/init.tests');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Valid username and password, expect to pass', async (done) => {
    const user = await usersGenerator();
    const validLoginData = {
      usernameOrEmail: user.username,
      password: user.password
    };

    const res = await request(app)
      .post('/api/login')
      .send(validLoginData)
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username', user.username);
    done();
  });

  it('Valid email and password, expect to pass', async (done) => {
    const user = await usersGenerator();
    const validLoginData = {
      usernameOrEmail: user.email,
      password: user.password
    };

    const res = await request(app)
      .post('/api/login')
      .send(validLoginData)
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username', user.username);
    done();
  });

  it('Valid username and invalid password, expect to fail', async (done) => {
    const user = await usersGenerator();
    const invalidLoginData = {
      usernameOrEmail: user.username,
      password: random.randomPassword()
    };

    const res = await request(app)
      .post('/api/login')
      .send(invalidLoginData)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(INVALID_USERNAME_OR_PASSWORD);
    done();
  });

  it('Valid email and invalid password, expect to fail', async (done) => {
    const user = await usersGenerator();
    const invalidLoginData = {
      usernameOrEmail: user.email,
      password: random.randomPassword()
    };

    const res = await request(app)
      .post('/api/login')
      .send(invalidLoginData)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(INVALID_USERNAME_OR_PASSWORD);
    done();
  });

  it('Invalid username and password, expect to fail', async (done) => {
    const invalidLoginData = {
      usernameOrEmail: random.randomUsername(),
      password: random.randomPassword()
    };

    const res = await request(app)
      .post('/api/login')
      .send(invalidLoginData)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(INVALID_USERNAME_OR_PASSWORD);
    done();
  });

  it('Invalid email and password, expect to fail', async (done) => {
    const invalidLoginData = {
      usernameOrEmail: random.randomEmail(),
      password: random.randomPassword()
    };

    const res = await request(app)
      .post('/api/login')
      .send(invalidLoginData)
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(INVALID_USERNAME_OR_PASSWORD);
    done();
  });
});