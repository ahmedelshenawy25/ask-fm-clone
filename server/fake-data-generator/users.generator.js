const mongoose = require('mongoose');
const faker = require('faker');
const UsersDAL = require('@UsersDAL');

async function usersGenerator (usersCount = 1) {
  const users = [];

  for (let i = 0; i < usersCount; i++) {
    const user = {
      _id: mongoose.Types.ObjectId(),
      firstName: randomFirstName(),
      lastName: randomLastName(),
      email: randomEmail(),
      username: randomUsername(),
      password: randomPassword()
    };

    await UsersDAL.createUser(user);
    users.push(user);
  }

  return usersCount === 1 ? users[0] : users;
}

function randomFirstName () {
  const firstName = faker.name.firstName();
  return firstName;
}

function randomLastName () {
  const lastName = faker.name.lastName();
  return lastName;
}

function randomPassword () {
  const passwordLength = faker.random.number({ min: 8, max: 64 });
  const password = faker.internet.password(passwordLength);
  return password;
}

function randomUsername () {
  let username = faker.internet.userName().toLowerCase();
  username = username.replace(/\./, '_');
  return username;
}

function randomEmail () {
  const email = faker.internet.email().toLowerCase();
  return email;
}

module.exports = {
  usersGenerator,
  randomFirstName,
  randomLastName,
  randomUsername,
  randomEmail,
  randomPassword
};