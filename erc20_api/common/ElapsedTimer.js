var moment = require("moment");

class ElapsedTimer {
  constructor() {
    this._time = moment(new Date().getTime());
  }

  end() {
    return moment(new Date().getTime()).diff(this._time);
  }
}

module.exports = ElapsedTimer;
