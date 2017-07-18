const dgram      = require("dgram");
const { expect } = require("chai");

const Server = require("../lib/server");

describe("Server", () => {
  describe("#start", () => {
    it("SHOULD receive UDP data packet", (done) => {
      const config  = {
        address: "127.0.0.1",
        port   : 9125,
      };
      const message = "Hey! Ya";

      const server  = new Server("udp4");
      const started = server.start(config, (data, rinfo) => {
        expect(message).to.be.equal(data.toString());
        expect(message.length).to.be.equal(rinfo.size);
        done();
      });
      expect(started).to.be.ok;

      const buf  = new Buffer(message);
      const sock = dgram.createSocket("udp4");
      sock.send(buf, 0, buf.length, config.port, config.address, () => {
        sock.close();
      });
    });
  });
});
