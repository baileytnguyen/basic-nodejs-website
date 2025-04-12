// routes/index.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Importing MySQL connection

const allowedTables = ['employees', 'customers', 'products']; // <-- your safe list

// Helper function to execute sanitized queries
const executeQuery = (table, limit) => {
  return new Promise((resolve, reject) => {
    // Sanitize the table name by checking against the allowed list
    if (!allowedTables.includes(table)) {
      return reject("Invalid table name.");
    }

    // For MySQL2, using query() instead of execute() for table names
    const query = `SELECT * FROM ${table} LIMIT ?`;

    // Use query instead of execute for dynamic table names
    db.query(query, [limit], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};
// GET route: Display data from 'employees' table by default
router.get("/", async (req, res, next) => {
  try {
    const table = 'employees';  // Default to 'employees' table
    const defaultRows = await executeQuery(table, 10);  // Default to 10 rows from the default table

    res.render("index", {
      title: "Friendly Software",
      queryResult: defaultRows,
      tableName: table,  // Pass the table name for clarity
    });
  } catch (err) {
    next(err);
  }
});

// POST route: Allow users to query any table (with safe list checking)
router.post("/query", async (req, res, next) => {
  const table = req.body.table?.trim();
  const limit = parseInt(req.body.limit) || 10;

  try {
    // Execute the query dynamically based on the user's input
    const rows = await executeQuery(table, limit);

    res.render("index", {
      title: "Friendly Software",
      queryResult: rows,
      tableName: table,  // Pass the table name for clarity
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
