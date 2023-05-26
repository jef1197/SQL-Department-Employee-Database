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
      switch(input.result) {
        case 'View all Departments':
          return this.viewDepartments();
        case 'Add a Department':
          return this.addDepartment();
        case 'View all Roles':
          return this.viewRoles();
        case 'Add a Role':
          return this.addRole();
        case 'View all Employees': 
          return this.viewEmployees();
        case 'Add an Employee': 
          return this.addEmplyoee();
        case 'Update an Employee': 
          return this.updateEmployee();
        default :
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      console.log('Oops. Something went wrong.');
    })
  }

  viewDepartments() {
    console.log('department')
    this.run();
  }

  addDepartment() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Department Name: ',
      },
    ])
    .then(input => {
      console.log(input)
    })
    .then( () => {
      console.log('added department to db')
      this.run();
    })
  }

  viewRoles() {
    console.log('role')
    this.run();
  }

  addRole() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'role',
        message: 'Role Name: ',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Salary: ',
      },
      {
        type: 'list',
        name: 'department',
        message: 'Choose department: ',
        choices: testarray,
      },
    ])
    .then(input => {
      console.log(input)
    })
    .then( () => {
      console.log('added role to db')
      this.run();
    })
  }

  viewEmployees() {
    console.log('employee')
    this.run();
  }

  addEmplyoee() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'First Name: ',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Last Name: ',
      },
      {
        type: 'list',
        name: 'role',
        message: 'Choose Role: ',
        choices: testarray,
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Choose Manager: ',
        choices: testarray,
      },
    ])
    .then(input => {
      console.log(input)
    })
    .then( () => {
      console.log('added employee to db')
      this.run();
    })
  }

  updateEmployee() {
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Choose Employee: ',
        choices: testarray,
      },
      {
        type: 'list',
        name: 'role',
        message: 'Choose Role: ',
        choices: testarray,      
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Choose Manager: ',
        choices: testarray,
      },
    ])
    .then(input => {
      console.log(input)
    })
    .then( () => {
      console.log('Updated employee to db')
      this.run();
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