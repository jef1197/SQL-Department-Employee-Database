const mysql = require('mysql2');
const inquirer = require('inquirer');
const { test } = require('node:test');

// Connect to database
// const db = mysql.createConnection(
//   {
//     host: 'localhost',
//     user: 'root',
//     password: '101894JefO!',
//     database: 'department_db'
//   },
//   console.log(`Connected to the department_db database.`)
// );

let testarray = ['test1', 'test2', 'test3'];
class CLI {
  constructor() {
  }

  run() {
    this.promptUser()
    .then(input => {
      if(input.result === 'quit') return;
    })
    .catch((err) => {
      console.log(err);
      console.log('Oops. Something went wrong.');
    })
  }


  promptUser() {
    return inquirer.
    prompt([
      {
        type: 'list',
        name: 'result',
        message: 'What would you like to do:',
        choices: ['view all departments', 'view all roles', 'view all employees',
      'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit'],
      },

    ])
  }
}

const cli = new CLI();

cli.run();