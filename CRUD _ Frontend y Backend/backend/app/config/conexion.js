const mysql = require('mysql');

const conexion = mysql.createConnection({
  host: "localhost",
  user: "Eloy",
  password: "$123456#",
  database: "products_db"
});

conexion.connect(function(err) {
  if (err) throw console.log("Connection failed") + err;
  console.log("Connected!");
});


module.exports = conexion;