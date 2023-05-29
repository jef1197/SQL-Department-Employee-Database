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

let testarray = ['test1', 'test2', 'test3'];
class CLI {
  constructor() {
  }

  run() {
    this.promptUser()
    .then(input => {
      if(input.result === 'Quit') return;
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
    const sql = `SELECT id, department_name AS department FROM department`;
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
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
      const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
    const params = input.name;
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: result
      });
    });
    })
    .then( () => {
      console.log('added department to db')
      this.run();
    })
  }

  viewRoles() {
    console.log('role')
    const sql = `SELECT id, title, salary, department_id FROM role`;
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
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
    console.log('employee');
    const sql = `SELECT id, first_name, last_name, role_id, manager_id FROM employee`;
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
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
        choices: ['View all Departments', 'View all Roles', 'View all Employees',
      'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee', 'Quit'],
      },

    ])
  }
}

const cli = new CLI();

cli.run();