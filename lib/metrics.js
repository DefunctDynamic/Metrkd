const _ = require("lodash");

const COUNTER_TYPE = "c";

function parse(expression) {
  let bucket;
  let value;
  let rate;
  let type;
  [bucket, expression] = expression.split(":");
  [value, type, rate]  = expression.split("|");

  value = _.toNumber(value);
  rate  = _.chain(rate).split("@").last().toNumber().valueOf();

  return {
    bucket,
    value,
    rate,
    type
  };
}

module.exports = {
  parse,
  COUNTER_TYPE
};
