const path = require('path');
const mongoose = require('mongoose');

const dotenvPath = process.env.NODE_ENV === 'development' ? '../config/.env.dev' : '../config/.env.prod';

require('dotenv').config({ path: path.join(__dirname, dotenvPath) });

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});