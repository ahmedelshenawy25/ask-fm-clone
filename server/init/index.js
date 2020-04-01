process.env.NODE_ENV !== 'production' ? require('./init.env') : '';
require('./init.database');
const app = require('./init.express');
require('./init.server')(app);