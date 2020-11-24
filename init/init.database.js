const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});