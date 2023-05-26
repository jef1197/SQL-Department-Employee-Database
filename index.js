const mysql = require('mysql2');
const inquirer = require('inquirer');
const { test } = require('node:test');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '101894JefO!',
    database: 'department_db'
  },
  console.log(`Connected to the department_db database.`)
);

