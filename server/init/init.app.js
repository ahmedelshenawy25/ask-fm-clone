const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const userRouter = require('../routes/user');
const questionRouter = require('../routes/question');
const testingRouter = require('../modules/users/users.routes');
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '../../client/build')));

app.use('/api', userRouter);
app.use('/api', questionRouter);
app.use('/testing', testingRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = app;