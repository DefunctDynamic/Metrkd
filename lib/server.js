const dgram = require("dgram");
const fs    = require("fs");
const net   = require("net");

const _ = require("lodash");

const etc = require("../etc");

const STATUS_CLOSED = "SERVER::STATUS::CLOSED";
const STATUS_LISTEN = "SERVER::STATUS::LISTEN";

class Server {
  constructor(address, port) {
    this._address = address;
    this._port    = port;
    this._status  = STATUS_CLOSED;
  }

  getAddress() {
    return this._address;
  }

  getPort() {
    return this._port;
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
    server.bind(
      this.getPort() || _.get(etc, ["server", "port"]),
      this.getAddress() || _.get(etc, ["server", "address"])
    );
    this.setStatus(STATUS_LISTEN);
  }
}

class TCPServer extends Server {
  constructor(address, port, socket, socketMode) {
    super(address, port);
    this._socket     = socket || null;
    this._socketMode = socketMode || null;
  }

  getSocket() {
    return this._socket;
  }

  getSocketMode() {
    return this._socketMode;
  }

  accept(callback) {
    const server = net.createServer((stream) => {
      stream.setEncoding("ascii");
      let buffer = Buffer.from("");
      stream.on("data", (data) => {
        buffer       = Buffer.concat([buffer, Buffer.from(data)]);
        const offset = buffer.lastIndexOf("\n");
        if (offset > -1) {
          const packet = buffer.slice(0, offset + 1);
          buffer       = buffer.slice(offset + 1);
          if (_.isFunction(callback)) {
            callback(packet, { size: packet.length });
          }
        }
      });
    });

    server.on("listening", () => {
      if (this.getSocket() && this.getSocketMode()) {
        fs.chmod(this.getSocket(), this.getSocketMode());
      }
    });

    process.on("exit", () => {
      if (this.getSocket()) {
        fs.unlinkSync(this.getSocket());
      }
    });

    server.listen(
      this.getSocket() || this.getPort() || _.get(etc, ["server", "port"]),
      this.getAddress() || _.get(etc, ["server", "address"])
    );
    this.setStatus(STATUS_LISTEN);
  }
}

module.exports = {
  UDPServer,
  TCPServer
};
