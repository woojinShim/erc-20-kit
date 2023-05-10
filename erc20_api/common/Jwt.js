var process = require("process");
const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const secretKey = process.env.ACCESS_TOKEN_SECRET;
const options = require("../config/jwtconfig").options;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  sign: async (user) => {
    /* 현재는 userid와 sec을 payload에 넣었지만 필요한 값을 넣으면 됨! */
    const payload = {
      userid: user.userid,
      sec: user.sec,
    };
    const result = {
      //sign메소드를 통해 access token 발급!
      accesstoken: jwt.sign(payload, secretKey, options),
      //refreshtoken: randToken.uid(256),
    };
    return result;
  },
  verify: async (token) => {
    let decoded;
    try {
      // verify를 통해 값 decode!
      decoded = await jwt.verify(token, secretKey);
    } catch (err) {
      if (err.message === "jwt expired") {
        return TOKEN_EXPIRED;
      } else if (err.message === "invalid token") {
        console.log(TOKEN_INVALID);
        return TOKEN_INVALID;
      } else {
        return TOKEN_INVALID;
      }
    }
    return decoded;
  },
};
