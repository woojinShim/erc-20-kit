var mysql = require("mysql2/promise");
var mysqlconfig = require("../config/mysql.js");
var pool = mysql.createPool(mysqlconfig);
var mybatismapper = require("mybatis-mapper");

// create the myBatisMapper from xml file
mybatismapper.createMapper(["xml/common.xml"]);

function MAKESQL(namespace, id, param, _sqlformat) {
  var sql = mybatismapper.getStatement(namespace, id, param, _sqlformat);
  SQL(namespace, id, sql);
  return sql;
}

function SQL(namespace, id, query) {
  if (id != "") {
    _logger.debug(`== SQL ${namespace}:${id}`);
    _logger.debug(`\n${query}`);
  }
}

module.exports = {
  mapper: mybatismapper,
  pool: pool,
  MAKESQL: MAKESQL,
  SQL: SQL,
};
