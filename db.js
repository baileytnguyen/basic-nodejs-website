// db.js
require('dotenv').config(); // Load environment variables from .env file
var mysql = require('mysql2');

// Create a connection to the database
var connection = mysql.createConnection({
    host: process.env.DB_HOST,        // Load from environment variable
    user: process.env.DB_USER,        // Load from environment variable
    password: process.env.DB_PASSWORD,// Load from environment variable
    database: process.env.DB_NAME     // Load from environment variable
});

connection.connect(function (err) {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as ID ' + connection.threadId);

    // Show the current database being used
    connection.query('SELECT DATABASE()', function (err, results) {
        if (err) {
            console.error('Error fetching the current database: ' + err.stack);
        } else {
            console.log('Currently using database: ' + results[0]['DATABASE()']);
        }
    });
});

module.exports = connection;
