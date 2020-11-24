const path = require('path');

require('dotenv').config({ path: path.join(__dirname, `../config/.env.${process.env.NODE_ENV}`) });