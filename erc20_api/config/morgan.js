var morgan = require("morgan");
const appRoot = require("app-root-path"); // app root 경로를 가져오는 lib
var rfs = require("rotating-file-stream"); // version 2.x

module.exports = function (app) {
  // create a rotating write stream
  var accessLogStream = rfs.createStream("access.log", {
    interval: "1d", // rotate daily
    path: `${appRoot}/logs`,
  });

  app.use(morgan("common", { stream: accessLogStream }));
};
