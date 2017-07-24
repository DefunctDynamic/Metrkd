const config = require("./lib/config");

function main({ configPath }) {
  try {
    config.load(configPath);
    global.console.log(config.get("servers"));
  } catch (error) {
    global.console.error({
      message: "failed to load config",
      error  : error
    });
  }
}

module.exports = main;
