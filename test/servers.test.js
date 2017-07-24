const dgram = require("dgram");
const fs    = require("fs");
const net   = require("net");

const _          = require("lodash");
const { expect } = require("chai");

const {
        UDPServer,
        TCPServer
      } = require("../lib/servers");

describe("UDPServer", () => {
  describe("#accept", () => {
    it("SHOULD accept UDP data packet", (done) => {
      const type    = "udp4";
      const address = "127.0.0.1";
      const port    = 9125;

      const message = "foobar:1337\n";

      const server = new UDPServer(type, address, port);
      expect(server.isClosed()).to.be.true;
      server.accept((data, rinfo) => {
        expect(message).to.be.equal(data.toString());
        expect(message.length).to.be.equal(rinfo.size);
        done();
      });
      expect(server.isListening()).to.be.true;

      const buffer = new Buffer(message);
      const socket = dgram.createSocket(type);
      socket.send(buffer, 0, buffer.length, port, address, () => {
        socket.close();
      });
    });
  });
});

describe("TCPServer", () => {
  describe("#accept", () => {
    it("SHOULD accept TCP data packet", (done) => {
      const address = "127.0.0.1";
      const port    = 10125;

      const message = "foobar:1337\n";

      const server = new TCPServer(address, port);
      expect(server.isClosed()).to.be.true;
      server.accept((data, rinfo) => {
        expect(message).to.be.equal(data.toString());
        expect(message.length).to.be.equal(rinfo.size);
        done();
      });
      expect(server.isListening()).to.be.true;

      const client = net.connect(port, address, () => {
        client.write(message);
        client.end();
      });
    });

    it("SHOULD accept TCP split data packet", (done) => {
      const address = "127.0.0.1";
      const port    = 10126;

      const message = "foobar:1223 bazbuffy:1337\n";

      const server = new TCPServer(address, port);
      expect(server.isClosed()).to.be.true;
      server.accept((data, rinfo) => {
        expect(message).to.be.equal(data.toString());
        expect(message.length).to.be.equal(rinfo.size);
        done();
      });
      expect(server.isListening()).to.be.true;

      const client = net.connect(port, address, () => {
        client.setNoDelay(true);
        _.each(message.split(" "), (_message) => {
          client.write(_message);
          client.write(" ");
        });
        client.end();
      });
    });

    it("SHOULD accept TCP data packet through unix socket", (done) => {
      const address = "127.0.0.1";
      const port    = null;

      const message = "foobar:1223 bazbuffy:1337\n";
      const socket  = "./tmp/test/stated.1.sock";

      const server = new TCPServer(address, port, socket);
      expect(server.isClosed()).to.be.true;
      server.accept((data, rinfo) => {
        expect(message).to.be.equal(data.toString());
        expect(message.length).to.be.equal(rinfo.size);
        done();
      });
      expect(server.isListening()).to.be.true;

      const client = net.connect(socket, address, () => {
        client.setNoDelay(true);
        _.each(message.split(" "), (_message) => {
          client.write(_message);
          client.write(" ");
        });
        client.end();
      });
    });
  });
});
