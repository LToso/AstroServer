const mysql = require("mysql");

var pool = mysql.createPool({
  user: "u978328913_astro",
  password: "467904Tos@",
  database: "u978328913_astro",
  host: "82.180.153.52",
  port: 3306,
});

exports.pool = pool;
