const moment = require("moment");

const RemoteIp = (_req) => {
  let ip =
    _req.headers["x-forwarded-for"] ||
    _req.connection.remoteAddress.split(`:`).pop();
  return ip;
};

const LastMonth = () => {
  const lastmonth = moment().add(-1, "months");
  return lastmonth.format("YYYYMM");
};

const RandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

module.exports.RemoteIp = RemoteIp;
module.exports.LastMonth = LastMonth;
module.exports.RandomString = RandomString;
