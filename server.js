const mysql = require('mysql2');
const inquirer = require('inquirer');


// connects to mysql 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`),
  optionsmenu()
  );

function optionsmenu() {
    inquirer.prompt({
     type: 'list',
     name: 'options',
     message: "What would you like to do?",
     choices: 
     ['View all departments', 
     'View all roles', 
     'View all employees', 
     'Add a department',
     'Add a role',
     'Add an employee',
     'Update an employee role', 
     'End'
    ],
    })
    .then((data) => {
        if (data.options === 'View all departments') {
            viewdept();
        } else if (data.options === 'View all roles') {
            viewroles();
        } else if (data.options === 'View all employees') {
            viewemployees();
        } else if (data.options === 'Add a department') {
            adddept();
        } else if (data.options === 'Add a role') {
            addrole();
        } else if (data.options === 'Add an employee') {
            addemployee();
        } else if (data.options === 'Update an employee role') {
            updaterole();
        } else if (data.options === 'End') {
            db.end();
}}
)}
    
// shows table from the database
function viewdept() {
        query = db.execute(`SELECT * FROM DEPARTMENT`);
        db.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
            optionsmenu()
})}

function viewroles() {
    query = db.execute(`SELECT roles.title, roles.salary, 
    roles.department_id AS role_id, department.names AS department FROM ROLES
    JOIN department ON roles.id = department.id`);
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        optionsmenu()
})}

function viewemployees() {
    query = db.execute(`SELECT employee.id, employee.first_name, 
    employee.last_name, roles.title, department.names AS department, roles.salary  
    FROM EMPLOYEE
    JOIN department ON employee.role_id = department.id
    JOIN roles ON employee.manager_id = roles.id`);
    db.query(query, (err, res) => {
        if (err) throw err; 
        console.table(res);
        optionsmenu()
})}

// adds data to the database
function adddept() {
    inquirer.prompt({
        type: 'input',
        name: 'dept',
        message: "What department would you like to add?",
        validate: deptinput => {            
            if (deptinput) {
            return true;
        } else {
            console.log('Enter a new department!');
            return false;
        }}
    })
    .then((data) => {
        db.query(`INSERT INTO department (names) VALUES ('${data.dept}')`, (err, res) => {
            if (err) throw err; 
            console.log(`${data.dept} has been added as a department.`);
            optionsmenu()
        }
        )})
}


function addrole() {
    const dept = [];
    db.query(`SELECT * FROM DEPARTMENT`, (err, res) => {
        if (err) throw err;
        res.map(data => {
            const deptdata = {
              name: data.names,
              value: data.id
            }
            dept.push(deptdata);
        })
    })    
    inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: "What role would you like to add?",
        validate: roleinput => {            
            if (roleinput) {
            return true;
        } else {
            console.log('Enter a new role!');
            return false;
        }}
    },
    {
        type: 'input',
        name: 'salary',
        message: "What is the salary of the role?",
        validate: salaryinput => {            
            if (salaryinput) {
            return true;
        } else {
            console.log('Enter a salary!');
            return false;
        }}
    },
    {
        type: 'list',
        name: 'dept',
        message: "What department is the role in?",
        choices: dept
    }
    ])
    .then((data) => {
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${data.title}', '${data.salary}', '${data.dept}')`, (err, res) => {
            if (err) throw err; 
            console.log(`${data.title} has been added as a role.`);
            optionsmenu()
        }
    )})
}

// pulls data from the database to use as options
    const role = [];
    db.query(`SELECT * FROM ROLES`, (err, res) => {
        if (err) throw err;
        res.map(data => {
            const roledata = {
              name: data.title, 
            }
            role.push(roledata);
        })
    });        
       const employee = [];
    db.query(`SELECT * FROM EMPLOYEE`, (err, res) => {
        if (err) throw err;
        res.map(data => {
            const employeedata = {
              name: data.first_name,
            }
            employee.push(employeedata);
        })
    }); 

function addemployee() {
    inquirer.prompt([
        {
        type: 'input',
        name: 'firstname',
        message: "What is the first name of the employee?",
        validate: firstnameinput => {            
            if (firstnameinput) {
            return true;
        } else {
            console.log('Enter a first name!');
            return false;
        }}
        },
        {
        type: 'input',
        name: 'lastname',
        message: "What is the last name of the employee?",
        validate: lastnameinput => {            
            if (lastnameinput) {
            return true;
        } else {
            console.log('Enter a last name!');
            return false;
        }}
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: role
        },
        {
            type: 'number',
            name: 'manager',
            message: "What is the employee's manager ID?",
            validate: managerinput => {            
                if (managerinput) {
                return true;
            } else {
                console.log('Enter a manager ID!');
                return false;
            }} 
        }
    ])
    .then((data) => {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES ('${data.firstname}', '${data.lastname}', '${data.role}', '${data.manager}')`, (err, res) => {
        if (err) throw err; 
        console.log(`${data.firstname} ${data.lastname} has been added as an employee.`);
        optionsmenu()
    })
    })}

function updaterole() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's new role?",
            choices: role
        },        
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's role do you want to update?",
            choices: employee
        },
    ])
    .then((data) => {
    db.query(`SELECT employee.id, employee.first_name, 
    employee.last_name, roles.title, department.names AS department, roles.salary  
    FROM EMPLOYEE
    JOIN department ON employee.role_id = department.id
    JOIN roles ON employee.manager_id = roles.id`);
    db.query(`UPDATE EMPLOYEE SET roles = '${data.role}' WHERE first_name = '${data.employee}'`, (err, res) => {
        if (err) throw err; 
        console.log(`${data.employee}'s role has been updated.`);
        optionsmenu() 
    })
    })   
}
