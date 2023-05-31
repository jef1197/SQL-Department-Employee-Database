const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

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

// Start App
  run() {
    this.promptUser()
    .then(input => {
      // Runs the function based on what the user has picked
      if(input.result === 'Quit') return;
      switch(input.result) {
        case 'View all Departments':
          return this.viewDepartments();
        case 'Add a Department':
          return this.addDepartment();
        case 'View all Roles':
          return this.viewRoles();
        case 'View Employees by Manager':
          return this.viewEmployeesbyManager();
        case 'View Employees by Department':
          return this.viewEmployeesbyDepartment();
        case 'Add a Role':
          return this.addRole();
        case 'View all Employees': 
          return this.viewEmployees();
        case 'Add an Employee': 
          return this.addEmplyoee();
        case 'Update an Employee': 
          return this.updateEmployee();
        case 'Delete Department': 
          return this.deleteDepartment();
        case 'Delete Role': 
          return this.deleteRole();
        case 'Delete Employee': 
          return this.deleteEmployee();
        case 'View Department Budget': 
          return this.viewDepartmentBudget();
        default :
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      console.log('Oops. Something went wrong.');
    })
  }

  // Views all Departments within the department table sorted by thier id
  viewDepartments() {
    const sql = `SELECT id, department_name from department ORDER BY id`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.table(rows)
      this.run();
    });
  }

  // adds a department to the db
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

  // Deletes a department
  deleteDepartment() {
    const sql = `SELECT department_name as department from department ORDER BY id`;
    let departmentArray = []
    // Creates an array of departments found in the department table
    db.promise().query(sql) 
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        departmentArray.push(rows[0][i].department)
      }
    })
    .then(() => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Choose department: ',
          choices: departmentArray,
        },
      ])
      .then (input => {
        const sql2 = `SELECT id from department WHERE department_name = '${input.department}'`;
        let d_id;
        db.promise().query(sql2)
        .then((rows, fields) => {
          d_id = rows[0][0].id;
          return d_id;
        })
        .then(params => {
          const sql3 = `DELETE FROM department WHERE id = ?`
          db.query(sql3, params, (err, result) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
          });
        })
        .then( () => {
          console.log('deleted department in db')
          this.run();
        })
      })
    })
  }

  // Viwes roles,salary, and which department it belongs too within the role table sorted by thier ids
  viewRoles() {
    const sql = `SELECT role.id, title, salary, department.department_name as department from role
    INNER JOIN department ON role.department_id = department.id ORDER BY id`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.table(rows)
      this.run();
    });
  }

  // Adds a role to db
  addRole() {
    const sql = `SELECT department_name as department from department ORDER BY id`;
    let departmentArray = []
    // Creates an array of departments found in the department table
    db.promise().query(sql)
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        departmentArray.push(rows[0][i].department)
      }
    })
    .then(() => {
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
      .then( input => {
        const sql2 = `SELECT id from department WHERE department_name = '${input.department}'`;
        let d_id;
        db.promise().query(sql2)
        .then((rows, fields) => {
          d_id = rows[0][0].id;
          return [input.title, input.salary, d_id];
        })
        .then((params) => {
          const sql3 = `INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, ?)`;  
          db.query(sql3, params, (err, result) => {
          });
        })
        .then(() => {
            this.run();
        })
      })
    })
    .catch(err => {
        console.log(err)
    })
  }

  // Deletes a role
  deleteRole() {
    const sql = `SELECT title from role ORDER BY id`;
    let roleArray = []
    // Creates an array of departments found in the department table
    db.promise().query(sql) 
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        roleArray.push(rows[0][i].title)
      }
    })
    .then(() => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'role',
          message: 'Choose Role: ',
          choices: roleArray,
        },
      ])
      .then(input => {
        const sql2 = `SELECT id from role WHERE title = '${input.role}'`;
        let r_id;
        db.promise().query(sql2)
        .then((rows, fields) => {
          r_id = rows[0][0].id;
          return r_id;
        })
        .then(params => {
          const sql3 = `DELETE FROM role WHERE id = ?`
          db.query(sql3, params, (err, result) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
          });
        })
        .then( () => {
          console.log('deleted role in db')
          this.run();
        })
      })
    })
  }

  // Views all employess within the employee table sorted by id
  viewEmployees() {
    const sql = `SELECT employee.id, first_name, last_name, role.title, role.salary, department.department_name as department, manager_id from employee
    INNER JOIN role on employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id ORDER BY id`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.table(rows);
      this.run();
    });
  }

  // Views all employess within the employee based on the manager 
  viewEmployeesbyManager() {
    const sql = `SELECT concat(first_name, ' ', last_name) as name from employee ORDER BY id`;
    let employeeArray = []
    // Creates an array of employees found in the employee table
    db.promise().query(sql)
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        employeeArray.push(rows[0][i].name)
      }
    })
    .then(()=> {
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Choose Manager to view which employees are under him/her: ',
          choices: employeeArray,
        },
      ])
      .then(input => {
        const sql2 = `SELECT id from employee WHERE concat(first_name, ' ', last_name) = '${input.employee}'`;
        let e_id;
        db.promise().query(sql2)
        .then((rows, fields) => {
          e_id = rows[0][0].id;
          return e_id;
        })
        .then(params => {
          const sql3 = `SELECT employee.id, first_name, last_name, role.title, role.salary, department.department_name as department, manager_id from employee
          INNER JOIN role on employee.role_id = role.id
          INNER JOIN department ON role.department_id = department.id
          where manager_id = ?;`;
          db.query(sql3, params, (err, rows) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
            console.table(rows);
            this.run();
          });
        })
      })
    })
  }

  // Views all employess within the employee based on the manager 
  viewEmployeesbyDepartment() {
    const sql = `SELECT department_name as department from department ORDER BY id`;
    let departmentArray = [];
    // Creates an array of departments found in the department table
    db.promise().query(sql)
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        departmentArray.push(rows[0][i].department)
      }
    })
    .then(() => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Choose department to view employees: ',
          choices: departmentArray,
        },
      ])
      .then (input => {

        const sql2 = `SELECT id from department WHERE department_name = '${input.department}'`;
        let d_id;
        db.promise().query(sql2)
        .then((rows, fields) => {
          d_id = rows[0][0].id;
          return d_id;
        })
        .then(params => {
          const sql2 = `SELECT employee.id, first_name, last_name, role.title, role.salary, department.department_name as department, manager_id from employee
          INNER JOIN role on employee.role_id = role.id
          INNER JOIN department ON role.department_id = department.id
          where department_id = ?;`;
          db.query(sql2, params, (err, rows) => {
            console.table(rows);
            this.run();
          });
        })
      })
    })
  }

  // Adds Employee to the db
  addEmplyoee() {
    const sql = `SELECT title from role ORDER BY id`;
    const sql2 = `SELECT concat(first_name, ' ', last_name) as name from employee ORDER BY id`
    let roleArray = [];
    let managerArray = [];
    // Creates a array of roles found in the role table
    db.promise().query(sql)
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        roleArray.push(rows[0][i].title)
      }
    })
    .then(() => {
      // Creates an array of employees found in the employee table
      db.promise().query(sql2)
      .then((rows, fields) => {
        for(let i = 0; i < rows[0].length; i++){
          managerArray.push(rows[0][i].name)
        }
        managerArray.push('null')
      });
    })
    .then(() => {
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
        const sql3 = `SELECT id from role WHERE title = '${input.role}'`;
        let r_id;
        db.promise().query(sql3)
        .then((rows, fields) => {
          r_id = rows[0][0].id;
        })
        .then(() => {
          const sql4 = `SELECT id from employee WHERE concat(first_name, ' ', last_name) = '${input.manager}'`;
          let m_id = null;
          db.promise().query(sql4)
          .then((rows, fields) => {
            if(rows[0][0]){
              m_id = rows[0][0].id;
            }
            return [r_id, input.first_name, input.last_name, m_id];
          })
          .then(params => {
            const sql5 = `INSERT INTO employee (role_id, first_name, last_name, manager_id)
            VALUES (?, ?, ?, ?)`;
            db.query(sql5, params, (err, result) => {
            })
            this.run();
          })
        })
      })
    })
  }

  // Updates the role and manager of a specified employee within the employee table
  updateEmployee() {
    const sql = `SELECT concat(first_name, ' ', last_name) as name from employee ORDER BY id`;
    const sql2 = `SELECT title from role ORDER BY id`;
    const sql3 = `SELECT concat(first_name, ' ', last_name) as name from employee ORDER BY id`;
    let employeeArray = [];
    let roleArray = [];
    let managerArray = [];
    // Creates an array of employees found in the employee table
    db.promise().query(sql)
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        employeeArray.push(rows[0][i].name)
      }
    })
    .then(() => {
      // Creates an array of role found in the role table
      db.promise().query(sql2) 
      .then((rows, fields) => {
        for(let i = 0; i < rows[0].length; i++){
          roleArray.push(rows[0][i].title)
        }
      });
    })
    .then(() => {
      // Creates an array of employees found in the employee table
      db.promise().query(sql3)
      .then((rows, fields) => {
        for(let i = 0; i < rows[0].length; i++){
          managerArray.push(rows[0][i].name)
        }
        managerArray.push('null');
      });
    })
    .then(() => {
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
        const sql4 = `SELECT id from role WHERE title = '${input.role}'`;
        let r_id;
        db.promise().query(sql4)
        .then((rows, fields) => {
          r_id = rows[0][0].id;
        })
        .then(() => {
          const sql5 = `SELECT id from employee WHERE concat(first_name, ' ', last_name) = '${input.manager}'`;
          let m_id = null;
          db.promise().query(sql5)
          .then((rows, fields) => {
            if(rows[0][0]){
              m_id = rows[0][0].id;
            }
          })
          .then(() => {
            const sql6 = `SELECT id from employee WHERE concat(first_name, ' ', last_name) = '${input.employee}'`;
            let e_id;
            db.promise().query(sql6)
            .then((rows, fields) => {
                e_id = rows[0][0].id;
                return [r_id, m_id, e_id];
            })
            .then (params => {
                const sql7 = ` UPDATE employee
                SET role_id = ?, manager_id = ?
                WHERE employee.id = ?;`
              db.query(sql7, params, (err, result) => {
                if (err) {
                  console.log({ error: err.message });
                  return;
                }
                this.run();
              });
            })
          })
        })
      })
    })

    
  }

  // Deletes a Employee
  deleteEmployee() {
    const sql = `SELECT concat(first_name, ' ', last_name) as name from employee ORDER BY id`;
    let employeeArray = []
    // Creates an array of departments found in the department table
    db.promise().query(sql)
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        employeeArray.push(rows[0][i].name)
      }
    })
    .then(() => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Choose Employee: ',
          choices: employeeArray,
        },
      ])
      .then (input => {
        const sql2 = `SELECT id from employee WHERE concat(first_name, ' ', last_name) = '${input.employee}'`;
        let e_id;
        db.promise().query(sql2)
        .then((rows, fields) => {
          e_id = rows[0][0].id;
          return e_id;
        })
        .then(params => {
          const sql3 = `DELETE FROM employee WHERE id = ?`
          db.query(sql3, params, (err, result) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
            this.run();
          });
        })
      })
    })
  }

  // View department budget
  viewDepartmentBudget() {
    const sql = `SELECT department_name as department from department ORDER BY id`;
    let departmentArray = []
    // Creates an array of departments found in the department table
    db.promise().query(sql)
    .then((rows, fields) => {
      for(let i = 0; i < rows[0].length; i++){
        departmentArray.push(rows[0][i].department)
      }
    })
    .then(() => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Choose department: ',
          choices: departmentArray,
        },
      ])
      .then (input => {
        const sql2 = `SELECT id from department WHERE department_name = '${input.department}'`;
        let d_id;
        db.promise().query(sql2)
        .then((rows, fields) => {
          d_id = rows[0][0].id;
          return d_id;
        })
        .then(params => {
          const sql3 = `SELECT SUM(role.salary), department.department_name as department from employee
          INNER JOIN role on employee.role_id = role.id
          INNER JOIN department ON role.department_id = department.id
          WHERE department.id = ?`
          db.query(sql3, params, (err, result) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
            console.table(result)
            this.run();
          });
        })
      })
    })
  }

  // Promts Users what they would like to do within the databse
  promptUser() {
    return inquirer.
    prompt([
      {
        type: 'list',
        name: 'result',
        message: 'What would you like to do:',
        choices: ['View all Departments', 'View Department Budget', 'View all Roles', 'View all Employees','View Employees by Manager',
        'View Employees by Department', 'Add a Department', 'Add a Role', 'Add an Employee', 
        'Update an Employee', 'Delete Department', 'Delete Role', 'Delete Employee', 'Quit'],
      },
    ])
  }
}

const cli = new CLI();

cli.run();