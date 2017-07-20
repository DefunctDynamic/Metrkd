const _     = require("lodash");
const dgram = require("dgram");

class UDPServer {
  constructor(type, config) {
    let _type    = type;
    this.getType = () => _type;

    let _config    = config;
    this.getConfig = () => _config;

    let _status    = UDPServer.STATUS_STOPPED;
    this.setStatus = (status) => {
      _status = status;
    };
    this.getStatus = () => _status;
  }

  getAddress() {
    return _.get(this.getConfig(), ["address"], "0.0.0.0");
  }

  getPort() {
    return _.get(this.getConfig(), ["port"], 8125);
  }

  isStarted() {
    return (this.getStatus() === UDPServer.STATUS_STARTED);
  }

  accept(callback) {
    const server = dgram.createSocket(this.getType(), callback);
    server.bind(this.getPort(), this.getAddress());
    this.setStatus(UDPServer.STATUS_STARTED);
  }
}

UDPServer.STATUS_STOPPED = "STOPPED";
UDPServer.STATUS_STARTED = "STARTED";

module.exports = UDPServer;
