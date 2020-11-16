const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const usersRouter = require('../modules/users/users.routes');
const questionsRouter = require('../modules/questions/questions.routes');
const friendsRouter = require('../modules/friends/friends.routes');
const ErrorHandler = require('@helpers/error-management/error.handler');

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
new ErrorHandler().registerAllErrorHandlers(app);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = app;