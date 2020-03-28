const path = require('path');
const http = require('http');

const dotenvPath = process.env.NODE_ENV === 'development' ? '../config/.env.dev' : '../config/.env.prod';

require('dotenv').config({ path: path.join(__dirname, dotenvPath) });

module.exports = (app) => {
  const port = process.env.PORT || 5000;
  const server = http.createServer(app);
  server.listen(port);
  server.on('listening', () => console.log('connected'));
};