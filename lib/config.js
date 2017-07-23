const fs = require("fs");

const _ = require("lodash");

class Configurator {
  constructor(config = {}) {
    this._config = config;
  }

  load(configPath) {
    try {
      this._config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (error) {
      throw error;
    }
  }

  get(path) {
    return _.get(this._config, path, null);
  }
}

module.exports = new Configurator();
