const _     = require("lodash");
const dgram = require("dgram");
const net   = require("net");

const { server } = require("../etc");

const STATUS_CLOSED = "SERVER::STATUS::CLOSED";
const STATUS_LISTEN = "SERVER::STATUS::LISTEN";

class Server {
  constructor(address, port) {
    this._address = address;
    this._port    = port;
    this._status  = STATUS_CLOSED;
  }

  getAddress() {
    return this._address || _.get(server, ["address"]);
  }

  getPort() {
    return this._port || _.get(server, ["port"]);
  }

  setStatus(status) {
    this._status = status;
  }

  isListening() {
    return _.eq(this._status, STATUS_LISTEN);
  }

  isClosed() {
    return _.eq(this._status, STATUS_CLOSED);
  }
}

class UDPServer extends Server {
  constructor(type, address, port) {
    super(address, port);
    this._type = type;
  }

  accept(callback) {
    const server = dgram.createSocket(this._type, callback);
    server.bind(this.getPort(), this.getAddress());
    this.setStatus(STATUS_LISTEN);
  }
}

class TCPServer extends Server {
  constructor(address, port) {
    super(address, port);
  }

  accept(callback) {
    const server = net.createServer((stream) => {
      stream.setEncoding("ascii");
      stream.on("data", (data) => {
        if (_.isFunction(callback)) {
          callback(data, { size: data.length });
        }
      });
    });
    server.listen(this.getPort(), this.getAddress());
    this.setStatus(STATUS_LISTEN);
  }
}


module.exports = {
  UDPServer,
  TCPServer
};
