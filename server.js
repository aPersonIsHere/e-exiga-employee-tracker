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

function init() {
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
                '.Update an employee role',
                '.Update employee manager',
                '.View employees by manager',
                '.Delete departments',
                '.Delete roles',
                '.Delete employees',
                '..View total utilized budget of a department'
            ]
        })
}

//This is the default response if all others before fail
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}`);
})
