const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('@UsersDAL');
const FollowsDAL = require('@FollowsDAL');

let app;
let user1;
let user2;
let user3;
let token;

describe('/friends', () => {
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

  describe('Get followed users', () => {
    it('User logged in, expect to pass', async (done) => {
      await FollowsDAL.create(user2._id, user1._id);
      await FollowsDAL.create(user3._id, user1._id);

      const res = await request(app)
        .get('/api/friends')
        .set('Authorization', token)
        .expect(200);

      res.body.forEach((user) => {
        expect(user).toHaveProperty('followedUser');
        expect(user.followedUser).toHaveProperty('_id');
        expect(user.followedUser).toHaveProperty('username');
        expect(user.followedUser).toHaveProperty('firstName');
        expect(user.followedUser).toHaveProperty('lastName');
      });
      done();
    });
  });
});