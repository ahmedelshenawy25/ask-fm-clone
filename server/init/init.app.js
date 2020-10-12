const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const usersRouter = require('../modules/users/users.routes');
const questionsRouter = require('../modules/questions/questions.routes');

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '../../client/build')));

app.use('/api', usersRouter);
app.use('/api', questionsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = app;