const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('../../users/usersDAL');
const Follow = require('../../../models/follow');
const QuestionsDAL = require('../questionsDAL');

let app;
let user1;
let user2;
let user3;
let token;

describe.only('/home', () => {
  beforeAll(() => {
    require('../../../init/init.env');
    require('../../../init/init.database');
    app = require('../../../init/init.app');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    user1 = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      username: 'johndoe',
      password: 'Abcdefg1!'
    };
    user2 = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      username: 'janedoe',
      password: 'Abcdefg1!'
    };
    user3 = {
      _id: mongoose.Types.ObjectId(),
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@smith.com',
      username: 'johnsmith',
      password: 'Abcdefg1!'
    };
    await UsersDAL.createUser(user1);
    await UsersDAL.createUser(user2);
    await UsersDAL.createUser(user3);
    token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('Get all answered questions by followed users', () => {
    it('isAnonymous set to false, expect to pass and have property sender', async (done) => {
      await QuestionsDAL.createQuestion({
        sender: user2._id,
        recipient: user2._id,
        question: 'aaaa',
        answered: true,
        answer: 'aaaa'
      });
      await QuestionsDAL.createQuestion({
        sender: user3._id,
        recipient: user3._id,
        question: 'bbbb',
        answered: true,
        answer: 'bbbb'
      });
      await Follow.create({
        followedUser: user2._id,
        followingUser: user1._id
      });
      await Follow.create({
        followedUser: user3._id,
        followingUser: user1._id
      });

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
      });
      done();
    });

    it('isAnonymous set to true, expect to pass and not have property sender', async (done) => {
      await QuestionsDAL.createQuestion({
        sender: user2._id,
        recipient: user2._id,
        question: 'aaaa',
        answered: true,
        answer: 'aaaa',
        isAnonymous: true
      });
      await QuestionsDAL.createQuestion({
        sender: user3._id,
        recipient: user3._id,
        question: 'bbbb',
        answered: true,
        answer: 'bbbb',
        isAnonymous: true
      });
      await Follow.create({
        followedUser: user2._id,
        followingUser: user1._id
      });
      await Follow.create({
        followedUser: user3._id,
        followingUser: user1._id
      });

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
  });

});