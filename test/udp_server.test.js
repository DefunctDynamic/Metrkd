const dgram      = require("dgram");
const { expect } = require("chai");

const UDPServer = require("../lib/udp_server");

describe("UDPServer", () => {
  describe("#accept", () => {
    it("SHOULD receive UDP data packet", (done) => {
      const type    = "udp4";
      const config  = {
        address: "127.0.0.1",
        port   : 9125
      };
      const message = "Hey! Ya";

      const server = new UDPServer(type, config);
      expect(server.isStarted()).to.be.false;
      server.accept((data, rinfo) => {
        expect(message).to.be.equal(data.toString());
        expect(message.length).to.be.equal(rinfo.size);
        done();
      });
      expect(server.isStarted()).to.be.true;

      const buffer = new Buffer(message);
      const socket = dgram.createSocket("udp4");
      socket.send(buffer, 0, buffer.length, config.port, config.address, () => {
        socket.close();
      });
    });
  });
});
