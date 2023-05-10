const appRoot = require("app-root-path"); // app root 경로를 가져오는 lib
const winston = require("winston"); // winston lib
const process = require("process");
const moment = require("moment-timezone");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}] ${message}`; // log 출력 포맷 정의
});

const appendTimestamp = format((info, opts) => {
  if (opts.tz) info.timestamp = moment().tz(opts.tz).format();
  return info;
});

const options = {
  // log파일
  file: {
    level: "debug",
    filename: `${appRoot}/logs/trace.log`, // 로그파일을 남길 경로
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: combine(
      label({ label: "log" }),
      appendTimestamp({ tz: "Asia/Seoul" }),
      myFormat // log 출력 포맷
    ),
  },
  // 개발 시 console에 출력
  console: {
    level: "debug",
    handleExceptions: true,
    json: false, // 로그형태를 json으로도 뽑을 수 있다.
    colorize: true,
    format: combine(
      label({ label: "console" }),
      appendTimestamp({ tz: "Asia/Seoul" }),
      myFormat
    ),
  },
};

let logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file), // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console(options.console)); // 개발 시 console로도 출력
}

global._logger = logger;

module.exports = logger;
