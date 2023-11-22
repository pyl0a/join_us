/**
 * @summary join_us
 * @description This is a simple Node.js application that uses Express.js and MySQL to 
 * create a database, create a table, insert data into the table, and query the table.
 */

// Import required modules
const { faker } = require('@faker-js/faker');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();

// Using dotenv to load environment variables from a .env file into process.env
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// ----------------------- App -----------------------

// Initialize express app
const app = express();
const port = 3000;

// 1. Set view engine to EJS
// 2. Use body-parser middleware to parse request bodies
// 3. Serve static files from 'public' directory
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// ----------------------- MySQL -----------------------

// Create a MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password", // Replace with your MySQL password
});

// Connect to MySQL
connection.connect((error) => {
    if (error) throw error;
    console.log("Connected!");
});

// ----------------------- Routes -----------------------
// Define routes
app.get('/create_db', createDatabase); // Route to create database
app.get('/create_table_followers', createFollowersTable); // Route to create followers table
app.get('/insert_followers', insertFollowers); // Route to insert followers
app.get('/', getCountOfUsers); // Route to get count of users
app.post('/register', registerNewEmail); // Route to register new email

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// ----------------------- Functions -----------------------

// Function to create database
function createDatabase(req, res, next) {
    const query = 'CREATE DATABASE IF NOT EXISTS join_us;';
    connection.query(query, (error, result) => {
        if (error) return next(error);
        console.log(result);
        res.send('Database created...');
    });
}

// Function to create followers table
function createFollowersTable(req, res, next) {
    const query = 'CREATE TABLE IF NOT EXISTS join_us.followers (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, created_at TIMESTAMP DEFAULT NOW());';
    connection.query(query, (error, result) => {
        if (error) return next(error);
        console.log(result);
        res.send('Table created...');
    });
}

// Function to insert followers
function insertFollowers(req, res, next) {
    const query = 'INSERT INTO join_us.followers (email, created_at) VALUES ?;';
    const followers = Array.from({length: 500}, () => [faker.internet.email(), faker.date.past()]);
    connection.query(query, [followers], (error, result) => {
        if (error) return next(error);
        console.log(result);
        res.send('followers inserted...');
    });
}

// Function to get count of users
function getCountOfUsers(req, res, next) {
    const query = 'SELECT COUNT(*) AS followers_count FROM join_us.followers;';
    connection.query(query, (error, results) => {
        if (error) return next(error);
        const count = results[0].followers_count;
        res.render('home', {count: count});
    });
}

// Function to register new email
function registerNewEmail(req, res, next) {
    const query = 'INSERT INTO join_us.followers SET ?';
    const person = {
        email : req.body.email
    }
    connection.query(query, person, (error, results) => {
        if (error) return next(error);
        console.log(results)
        res.send("Thanks for joining");
    });
}
