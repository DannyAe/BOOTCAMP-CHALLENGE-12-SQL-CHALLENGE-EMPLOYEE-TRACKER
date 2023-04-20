const inquirer = require("inquirer")
const mysql = require("mysql2")
require("console.table");
const db = require("./connection")

//in connection.js now//
// const db=mysql.createConnection({
//     host: "localhost", 
//     user: "root",
//     password: "nineteen99",
//     database: "employees_db"

// })

function main(){
    inquirer.prompt([{
        type: "list",
        name: "options",
        message: "choose from the options below",
        choices: [
        
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",         
        ]
    }])

    .then((choice)=>{
        console.log(choice)

        switch (choice.options) {
            case 'view all departments':
                viewAllDepartment()
                break
            case 'view all roles':
                viewAllRoles()
                break
            case 'view all employees':
                viewAllEmployees()
                break
            case 'add a department':
                addDepartment()
                break
            case 'add a role':
                addRole()
                break
            case 'add an employee':
                addEmployee()
                break
            case 'update an employee role':
                updateEmployeeRole()
                break

            default:
                console.log("something went wrong")
                break
             
          }
    })

}
function viewAllDepartment(){
db.promise().query("SELECT * FROM department").then(data=>{
    console.table(data[0])
    main()
})
}

function viewAllRoles(){
    db.promise().query("SELECT * FROM role").then(data=>{
        console.table(data[0])
        main()
    })
    }

function viewAllEmployees(){
    db.promise().query("SELECT * FROM employee").then(data=>{
        console.table(data[0])
        main()
    })
    }

function addDepartment(){
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "what department wouldyou like to add?",

    }])
    .then(async answer => {
        await db.promise().query(`insert into department (name) values ('${answer.department}')`)
        viewAllDepartment()
    })
}


async function addRole(){
    const [departments]= await db.promise().query("SELECT * FROM department")
    inquirer.prompt([{
        type: "input",
        name: "title",
        message: "what title would you like to add?",
    

    },{
        type: "input",
        name: "salary",
        message: "what is the salary for this role?",
    },{
        type: "list",
        name: "department_id",
        message: "Please select department for this role",
        choices: departments.map(({name,id})=>({
        name,
        value: id
        }))

    }])
    .then(async answer => {
        await db.promise().query(`insert into role (title,salary,department_id) values ('${answer.title}',${answer.salary}, ${answer.department_id})`)
        viewAllRoles()
    })
}

async function addEmployee(){
    const [roles]= await db.promise().query("SELECT * FROM role")
    const [employees]= await db.promise().query("SELECT * FROM employee")
    inquirer.prompt([{
        type: "input",
        name: "first_name",
        message: "what is the first name?",
    

    },{
        type: "input",
        name: "last_name",
        message: "what is the last name?",
    },{
        type: "list",
        name: "role_id",
        message: "Please select department for this role",
        choices: roles.map(({title,id})=>({
        name: title, 
        value: id
        }))

    },{
        type: "list",
        name: "manager_id",
        message: "Who is the manager for this employee?",
        choices: employees.map(({first_name, last_name, id})=>({
        name: first_name + " " + last_name,
        value: id
        }))
    }])
    .then(async answer => {
        await db.promise().query(`insert into employee (first_name, last_name, role_id, manager_id) values ('${answer.first_name}','${answer.last_name}', ${answer.role_id}, ${answer.manager_id})`)
        viewAllEmployees()
    })
}

async function updateEmployeeRole(){
    const [roles]= await db.promise().query("SELECT * FROM role")
    const [employees]= await db.promise().query("SELECT * FROM employee")
    inquirer.prompt([{
        type: "list",
        name: "employee",
        message: "please choose and employee to update?",
        choices: employees.map(({first_name, last_name, id})=>({
            name: first_name + " " + last_name,
            value: id
            }))
    
    },
       
    {
        type: "list",
        name: "role_id",
        message: "Please choose new role",
        choices: roles.map(({title,id})=>({
        name: title, 
        value: id
        }))

    }])
    .then(async answer => {
        await db.promise().query(`update employee set role_id = ${answer.role_id} where id= ${answer.employee}`)
        viewAllEmployees()
    })
}

main()