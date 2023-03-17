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
            case 'view all employees':
            case 'add a department':
            case 'add a role':
            case 'add an employee':
            case 'update an employee role':
            
              break;
            default:
             
          }
    })

}
function viewAllDepartment(){
db.promise().query("SELECT * FROM department").then(data=>{
    console.table(data)
})
}

main()