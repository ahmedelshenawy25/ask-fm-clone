const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const usersRouter = require('../modules/users/users.routes');
const questionsRouter = require('../modules/questions/questions.routes');
const friendsRouter = require('../modules/friends/friends.routes');
const OperationalError = require('@helpers/error-management/operatinal.error');

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '../../client/build')));

app.use('/api', usersRouter);
app.use('/api', questionsRouter);
app.use('/api', friendsRouter);

app.use((err, req, res, next) => {
  if (err instanceof OperationalError)
    return res.status(err.httpCode).json({ message: err.message });
  // logger
  res.status(500).json({ message: 'Internal Server Error' });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  // logger
  console.log(error);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  // logger
  console.log(reason);
  process.exit(1);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = app;