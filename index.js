const mysql = require('mysql2');
const inquirer = require('inquirer');
const { test } = require('node:test');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'department_db'
  },
  console.log(`Connected to the department_db database.`)
);

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
    const sql = `SELECT id, department_name from department ORDER BY id`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.log(rows)
      this.run();
    });
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
    const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
    const params = input.name;
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
    });
    })
    .then( () => {
      console.log('added department to db')
      this.run();
    })
  }

  viewRoles() {
    const sql = `SELECT role.id, title, salary, department.department_name as department from role
    INNER JOIN department ON role.department_id = department.id ORDER BY id`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.log(rows)
      this.run();
    });
  }

  addRole() {
    const sql = `SELECT department_name as department from department ORDER BY id`;
    let departmentArray = []
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      for(let i = 0; i < rows.length; i++){
        departmentArray.push(rows[i].department)
      }
    });
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
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
        choices: departmentArray,
      },
    ])
    .then(input => {
      const sql2 = `INSERT INTO role (title, salary, department_id)
      VALUES (?, ?, ?)`;
      let d_id = departmentArray.indexOf(input.department) + 1;
      const params = [input.title, input.salary, d_id];
      db.query(sql2, params, (err, result) => {
        if (err) {
          console.log({ error: err.message });
          return;
        }
      });
    })
    .then( () => {
      console.log('added role to db')
      this.run();
    })
  }

  viewEmployees() {
    const sql = `SELECT employee.id, first_name, last_name , role.title, department.department_name as department, manager_id from employee
    INNER JOIN role on employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id ORDER BY id`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.log(rows);
      this.run();
    });
  }

  addEmplyoee() {
    const sql = `SELECT title from role ORDER BY id`;
    const sql2 = `SELECT concat(first_name, ' ', last_name) as name from employee ORDER BY id`
    let roleArray = [];
    let managerArray = [];
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      for(let i = 0; i < rows.length; i++){
        roleArray.push(rows[i].title)
      }
    });
    db.query(sql2, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      for(let i = 0; i < rows.length; i++){
        managerArray.push(rows[i].name)
      }
      managerArray.push('null')
    });

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
        choices: roleArray,
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Choose Manager: ',
        choices: managerArray,
      },
    ])
    .then(input => {
      const sql3 = `INSERT INTO employee (role_id, first_name, last_name, manager_id)
      VALUES (?, ?, ?, ?)`;
      let r_id = roleArray.indexOf(input.role) + 1;
      let m_id;
      if (input.manager === 'null') {
        m_id = null;
      } else {
        m_id = managerArray.indexOf(input.manager) + 1;
      }
      const params = [r_id, input.first_name, input.last_name, m_id];
      db.query(sql3, params, (err, result) => {
        if (err) {
          console.log({ error: err.message });
          return;
        }
      });
    })
    .then( () => {
      console.log('added employee to db')
      this.run();
    })
  }

  updateEmployee() {
    const sql = `SELECT concat(first_name, ' ', last_name) as name from employee ORDER BY id`;
    const sql2 = `SELECT title from role ORDER BY id`;
    const sql3 = `SELECT concat(first_name, ' ', last_name) as name from employee ORDER BY id`;
    let employeeArray = []
    let roleArray = [];
    let managerArray = [];
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      for(let i = 0; i < rows.length; i++){
        employeeArray.push(rows[i].name)
      }
    })
    db.query(sql2, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      for(let i = 0; i < rows.length; i++){
        roleArray.push(rows[i].title)
      }
    });
    db.query(sql3, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      for(let i = 0; i < rows.length; i++){
        managerArray.push(rows[i].name)
      }
      managerArray.push('null');
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Choose Employee: ',
          choices: employeeArray,
        },
        {
          type: 'list',
          name: 'role',
          message: 'Choose Role: ',
          choices: roleArray,      
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Choose Manager: ',
          choices: managerArray,
        },
      ])
      .then(input => {
        const sql4 = ` UPDATE employee
        SET role_id = ?, manager_id = ?
        WHERE employee.id = ?;`
        let r_id = roleArray.indexOf(input.role) + 1;
        let m_id;
        if (input.manager === 'null') {
          m_id = null;
        } else {
          m_id = managerArray.indexOf(input.manager) + 1;
        }
        let e_id = employeeArray.indexOf(input.employee) + 1;
        const params = [r_id, m_id, e_id];
        db.query(sql4, params, (err, result) => {
          if (err) {
            console.log({ error: err.message });
            return;
          }
        });
      })
      .then( () => {
        console.log('Updated employee to db')
        this.run();
      })
    });
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