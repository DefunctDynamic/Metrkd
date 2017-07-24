const { expect } = require("chai");

const metrics = require("../lib/metrics");

describe("metrics", () => {
  describe(".parse", () => {
    it("SHOULD parse a metric; GIVEN a valid expression", () => {
      const expression = "gorets:1|c|@0.1";
      const metric     = metrics.parse(expression);
      expect(metric.type).to.be.equal(metrics.COUNTER_TYPE);
      expect(metric.bucket).to.be.equal("gorets");
      expect(metric.value).to.be.equal(1);
      expect(metric.rate).to.be.equal(0.1);
    });
  });
});
