const http = require('http');
const logger = require('@helpers/logger');

module.exports = (app) => {
  const port = process.env.PORT || 5000;
  const server = http.createServer(app);
  server.listen(port);
  server.on('listening', () => logger.info(`Server started on port ${port}`));
};