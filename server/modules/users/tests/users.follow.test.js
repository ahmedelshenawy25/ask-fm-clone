const mongoose = require('mongoose');
const request = require('supertest');
const UsersDAL = require('../usersDAL');
const Follow = require('../../../models/follow');

let app;
let user1;
let user2;
let token;

describe('/follow/:username', () => {
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
    await UsersDAL.createUser(user1);
    await UsersDAL.createUser(user2);
    token = `Bearer ${UsersDAL.generateAuthToken(user1)}`;
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('Follow a user', () => {
    it('Valid username and user isn\'t followed, expect to pass', async (done) => {
      const { username } = user2;

      await request(app)
        .post(`/api/follow/${username}`)
        .set('Authorization', token)
        .expect(201);

      done();
    });
    it('Invalid username, expect to fail', async (done) => {
      const invalidUsername = 'invalidUsername';

      await request(app)
        .post(`/api/follow/${invalidUsername}`)
        .set('Authorization', token)
        .expect(400);

      done();
    });
    it('Valid username and user is followed, expect to fail', async (done) => {
      const { username } = user2;
      await Follow.create({
        followedUser: user2._id,
        followingUser: user1._id
      });

      await request(app)
        .post(`/api/follow/${username}`)
        .set('Authorization', token)
        .expect(400);

      done();
    });
  });
});