const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
//Use DOTenv to hide our variables
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

//Define the middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Connect to a database
//Use Dotenv to hide the variables
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    init()
)

function printDepartments() {
    db.promise().query("SELECT * FROM department")
        .then( ([rows, fields]) => {
            console.table(rows);
        })
        .catch(console.log)
        .then( () => {
            init();
        });
};

function printRoles() {
    db.promise().query("SELECT * FROM role")
        .then( ([rows, fields]) => {
            console.table(rows);
        })
        .catch(console.log)
        .then( () => {
            init();
        });
}

function printEmployees() {
    db.promise().query("SELECT * FROM employee")
        .then( ([rows, fields]) => {
            console.table(rows);
        })
        .catch(console.log)
        .then( () => {
            init();
        });
}

function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            message: 'What department would you like to add? (Capitalize Like This)',
            name: 'departmentName'
        })
        .then((responses) => {
            console.log('\n');
            if(responses.departmentName.trim() == '') {
                console.log('Please type a name for the new department. Try again.');
                init();
            } else {
                db.promise().query(`INSERT INTO department (name) VALUES ('${responses.departmentName.trim()}')`)
                .then( ([rows, fields]) => {
                    console.log(`\nAddition of department ${responses.departmentName.trim()} is successful!`);
                })
                .catch(console.log)
                .then( () => {
                    init();
                });
            }
        });
}

function addRole() {
    inquirer
        .prompt([{
            type: 'input',
            message: 'What is the name of the role? (Capitalize Like This)',
            name: 'roleName'
        },
        {
            type: 'number',
            messsage: 'What is the hourly salary of the role?',
            name: 'roleSalary'
        },
        {
            type: 'input',
            message: 'What is the department that this role is categorized under? (Use the ID.)',
            name: 'roleDepartment'
        }
        ])
        .then((responses) => {
            console.log('\n');
            if(responses.roleName.trim() == '' || responses.roleSalary == '' || responses.roleDepartment.trim() == '') {
                console.log('A field is missing. Try again.');
                init();
            } else {
                db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES ('${responses.roleName.trim()}', '${responses.roleSalary}', '${responses.roleDepartment.trim()}')`)
                .then( ([rows, fields]) => {
                    console.log(`\nAddition of role ${responses.roleName.trim()}, salary ${responses.roleSalary}, and department ${responses.roleDepartment.trim()} is successful!`);
                })
                .catch(console.log)
                .then( () => {
                    init();
                });
            }
        });
}

function addEmployee() {
    inquirer
        .prompt([{
            type: 'input',
            message: 'What is the first name of the employee?',
            name: 'employeeFirstName'
        },
        {
            type: 'input',
            messsage: 'What is the last name of the employee?',
            name: 'employeeLastName'
        },
        {
            type: 'input',
            message: 'What is the role that this employee is categorized under? (Use the ID.)',
            name: 'employeeRole'
        },
        {
            type: 'input',
            message: 'What is the manager role that this employee is categorized under? (Use the ID.)',
            name: 'employeeManager'
        }
        ])
        .then((responses) => {
            console.log('\n');
            if(responses.employeeFirstName.trim() == '' || responses.employeeLastName.trim() == '' || responses.employeeRole == '' || responses.employeeManager == '') {
                console.log('A field is missing. Try again.');
                init();
            } else {
                db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${responses.employeeFirstName.trim()}', '${responses.employeeLastName.trim()}', '${responses.employeeRole}', '${responses.employeeManager}')`)
                .then( ([rows, fields]) => {
                    console.log(`\nAddition of employee ${responses.employeeFirstName.trim()} ${responses.employeeLastName.trim()} in ${responses.employeeRole.trim()} under manager ${responses.employeeManager}!`);
                })
                .catch(console.log)
                .then( () => {
                    init();
                });
            }
        });
}

function updateEmployeeRole() {
    inquirer
        .prompt([{
            type: 'input',
            message: 'Enter the employee\'s ID of whom you want to update:',
            name: 'employeeID'
        },
        {
            type: 'input',
            message: 'Enter the employee\'s new role ID:',
            name: 'newRoleID'
        },
        ])
        .then((responses) => {
            console.log('\n');
            if(responses.employeeID.trim() == '' || responses.newRoleID.trim() == '') {
                console.log('A field is missing. Try again.');
                init();
            } else {
                db.promise().query(`UPDATE employee SET rold_id = '${responses.newRoleID.trim()}' WHERE id = ${responses.employeeID.trim()}`)
                .then( ([rows, fields]) => {
                    console.log(`\nUpdating of ID ${responses.employeeID.trim()} employee\'s role to role of ID ${responses.newRoleID.trim()}!`);
                })
                .catch(console.log)
                .then( () => {
                    init();
                });
                
            }
        });
}

/*TODO:         
                'Update employee manager',
                'View employees by manager',
                'Delete departments',
                'Delete roles',
                'Delete employees',
                'View total utilized budget of a department'
*/

function init() {
    console.log('\n');
    inquirer
        .prompt({
            type: 'list',
            message: 'Welcome to the Home Screen!',
            name: 'userChoice',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit Program',
            ]
        })
        .then((responses) => {
            console.log('\n');
            switch(responses.userChoice) {
                case 'View all departments':
                    printDepartments();
                    break;
                case 'View all roles':
                    printRoles();
                    break;
                case 'View all employees':
                    printEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Quit Program':
                    console.log(`Thank you! Credits: Emmanuel Exiga`);
                    process.exit();
                    break;
                default:
                    console.log(`${responses.userChoice} will be added in a future update! Apologies for the inconvenience.`)
            }
            
        })
}

//This is the default response if all others before fail
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}`);
})
