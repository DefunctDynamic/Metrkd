const dgram = require("dgram");

class Server {
  constructor(type) {
    this.type = type;
  }

  start(config, callback) {
    const server = dgram.createSocket(this.type, callback);
    server.bind(config.port, config.address);
    this.server = server;
    return true;
  }
}

module.exports = Server;
