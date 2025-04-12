var express = require('express');
var router = express.Router();
var connection = require('../db');  // Import the MySQL connection

/* GET users listing. */
router.get("/", function (req, res, next) {
  connection.query('SELECT * FROM employees LIMIT 10', function (err, results) {
    if (err) {
      return next(err); // Pass any errors to the error handler
    }

    res.render("users", { title: "Friendly Software", employees: results });
  });
});

module.exports = router;
