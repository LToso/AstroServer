const mysql = require("mysql");

var pool = mysql.createPool({
  user: "u978328913_astro",
  password: "467904Tos@",
  database: "u978328913_astro",
  host: "82.180.153.52",
  port: 3306,
});

var run = (query, parameters) => {
  try {
    return new Promise(resolve =>
      pool.getConnection((error, con) => {
        if (error)
          resolve(error);
        con.query(query, parameters,          
          (error, result) => {
            con.release();
            if (error)
              resolve(error);
            resolve(result);
          });
      }));
  }
  catch (error) {
    throw error;
  }
}

exports.pool = pool;
exports.run = run;
