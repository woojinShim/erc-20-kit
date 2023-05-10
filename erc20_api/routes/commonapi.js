var Response = require("../common/Response");
var ElapsedTimer = require("../common/ElapsedTimer");

var util = require("util");

var SvcCommon = require("../services/SvcCommon");

module.exports = function (app) {
  /*
	test api
	*/
  app.post("/v1/test", function (req, res) {
    let cmd = "/v1/test";
    _logger.debug(`POST == ${cmd}`);

    var t = new ElapsedTimer();

    _logger.debug(util.inspect(req.body));

    let svc = new SvcCommon(cmd, req.body, req, res, t);
    svc.v1_test();
  });

  app.post("/v1/txFee", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let cmd = "/v1/txFee";
    _logger.debug(`POST == ${cmd}`);

    var t = new ElapsedTimer();

    _logger.debug(util.inspect(req.body));

    let svc = new SvcCommon(cmd, req.body, req, res, t);
    svc.v1_txFee();
  });

  app.post("/v1/sendToken", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let cmd = "/v1/sendToken";
    _logger.debug(`POST == ${cmd}`);

    var t = new ElapsedTimer();

    _logger.debug(util.inspect(req.body));

    let svc = new SvcCommon(cmd, req.body, req, res, t);
    svc.v1_sendToken();
  });
};
