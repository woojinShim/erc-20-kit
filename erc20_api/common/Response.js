var util = require("util");

class Response {
  constructor(cmd, code, result, t) {
    this.cmd = cmd;
    this.resultCode = code.value;
    this.resultMessage = code.message;
    this.result = result;
    this.t = t;
  }

  build() {
    var packet = {};

    packet.resultCode = this.resultCode;
    packet.resultMessage = this.resultMessage;
    packet.result = this.result;

    _logger.debug(
      " RESPONSE [" +
        this.resultCode +
        "] " +
        this.cmd +
        " (" +
        this.t.end() +
        "ms) >> " +
        util.inspect(packet)
    );

    return packet;
  }
}

module.exports = Response;
