const dgram      = require("dgram");
const { expect } = require("chai");

const { UDPServer } = require("../lib/server");

describe("UDPServer", () => {
  describe("#accept", () => {
    it("SHOULD receive UDP data packet", (done) => {
      const type    = "udp4";
      const address = "127.0.0.1";
      const port    = 9125;

      const message = "Hey! Ya";

      const server = new UDPServer(type, address, port);
      expect(server.isClosed()).to.be.true;
      server.accept((data, rinfo) => {
        expect(message).to.be.equal(data.toString());
        expect(message.length).to.be.equal(rinfo.size);
        done();
      });
      expect(server.isListening()).to.be.true;

      const buffer = new Buffer(message);
      const socket = dgram.createSocket("udp4");
      socket.send(buffer, 0, buffer.length, port, address, () => {
        socket.close();
      });
    });
  });
});
