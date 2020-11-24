if (process.env.NODE_ENV !== 'production') {
  require('./init.env');
}
require('module-alias/register');
require('./init.database');
const app = require('./init.app');
require('./init.server')(app);