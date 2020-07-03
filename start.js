var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "strongpassword2020",
  database: "employee_trackerDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  wrapper();
});

function wrapper() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "Choice",
          message: "What would you like to do?",
          choices: ["View all employees", "View all employees by Department", "View all employees by role", "Add employee", "Add Department", "Add role", "Update employee role"],
        },
      ])
      .then(function (selection) {
        switch (selection.Choice) {
          case "View all employees":
            viewAll();
            break;
          case "View all employees by Department":
            viewDept();
            break;
            case "View all employees by role":
            viewRole();
            break;
            case "Add employee":
            addEmployee();
            break;
            case "Add Department":
            addDepartment();
            break;
            case "Add role":
            addRole();
            break;
            case "Update employee role":
            updateRole();
            break;
          default:
           
        }
      });
  }

    function viewAll(){
    connection.query(`SELECT e.id, e.first_name, e.Last_name, title, name as "Department", salary, CONCAT (m.first_name," ", m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id 
    INNER JOIN employee m ON e.manager_id = m.id;`, function(err, res) {
        if (err) throw err;
        items = res;
        console.table(res);
        //connection.end();
      });
      setTimeout(function afterTwoSeconds() {
        wrapper();
      }, 200)
  };

  function viewDept(){
    connection.query(`SELECT name as "Department", e.id, e.first_name, e.Last_name, title, salary, CONCAT (m.first_name," ", m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id 
    INNER JOIN employee m ON e.manager_id = m.id
    ORDER by name DESC;`, function(err, res) {
        if (err) throw err;
        items = res;
        console.table(res);
       // connection.end();
      });
      setTimeout(function afterTwoSeconds() {
        wrapper();
      }, 200)
  };

  function viewRole(){
    connection.query(`SELECT title as "Role", name as "Department", e.id, e.first_name, e.Last_name, salary, CONCAT (m.first_name," ", m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id 
    INNER JOIN employee m ON e.manager_id = m.id
    ORDER by title DESC;`, function(err, res) {
        if (err) throw err;
        items = res;
        console.table(res);
       // connection.end();
      });
      setTimeout(function afterTwoSeconds() {
        wrapper();
      }, 200)
  };

  function addEmployee(){
    var managers = [];
    connection.query(`SELECT name as "Department", e.id, CONCAT (e.first_name," ", e.Last_name) AS "Name", title, salary, CONCAT (m.first_name," ", m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id 
    INNER JOIN employee m ON e.manager_id = m.id
    where title like '%manager%' or '%director%';`, function(err, res) {
        if (err) throw err;
        managers = res;
      });
    var roles = [];
      connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        roles = res;
      });
      setTimeout(function afterTwoSeconds() {
      inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter new employee first name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter new employee last name",
      },
      {
        type: "list",
        name: "managerID",
        message: "Select new employee manager",
        choices: function(){
            var mgr = []
            for (i=0; i<managers.length; i++){
                mgr.push(managers[i].Name)
                }
                return mgr;
        }
      },
      {
        type: "list",
        name: "roleID",
        message: "Select new employee role id",
        choices: function(){
            var titles = []
            for (i=0; i<roles.length; i++){
                titles.push(roles[i].title)
                }
                return titles;
        }
      },
    ])
    .then(function (answer) {
      //const Item = [answer.itemName, answer.itemBid];
      console.log("Inserting a new employee...\n");
      var mgrID = 0;
      for (i=0;i<managers.length; i++){
          if (managers[i].Name == answer.managerID){
              mgrID=i;
          }
      }
      console.log(managers[mgrID].id)
      var rolID = 0;
      for (i=0; i<roles.length; i++){
          if (roles[i].title==answer.roleID){
              rolID=i;
          }
      }
      console.log(roles[rolID].id)
      var query = connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roles[rolID].id,
          manager_id: managers[mgrID].id,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " item inserted!\n");
          // Call updateProduct AFTER the INSERT completes
         viewAll();
        }
      );

    }); 
      }, 200)
    
  };

  function addDepartment(){
    inquirer
    .prompt([
      {
        type: "input",
        name: "depName",
        message: "Which is the new department name?",
      },
      {
        type: "input",
        name: "depID",
        message: "Which is the new department id?",
      },
    ])
    .then(function(answer) {
      
      console.log("Inserting a new Department...\n");
      var query1 = connection.query("INSERT INTO department SET ?",
        {
          name: answer.depName,
          id: answer.depID,
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " item inserted!\n");
            // Call updateProduct AFTER the INSERT completes
           viewAll();
          }
      );
    });

  };

  function addRole(){
    var departments = [];
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      departments = res;
    });
    setTimeout(function afterTwoSeconds() {
    inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Which is the new Role name?",
      },
      {
        type: "input",
        name: "roleID",
        message: "Which is the new Role id?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Which is the new Role salary?",
      },
      {
        type: "list",
        name: "departmentID",
        message: "Select new role department",
        choices: function(){
            var deps = []
            for (i=0; i<departments.length; i++){
                deps.push(departments[i].name)
                }
                return deps;
        }
      },
    ])
    .then(function(answer) {
      
      console.log("Inserting a new Role...\n");
      var depID = 0;
      for (i=0; i<departments.length; i++){
          if (departments[i].name==answer.departmentID){
              depID=i;
          }
      }
      var query1 = connection.query("INSERT INTO role SET ?",
        {
          title: answer.roleName,
          id: answer.roleID,
          salary: answer.roleSalary,
          department_id: departments[depID].id
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " item inserted!\n");
            // Call updateProduct AFTER the INSERT completes
           viewAll();
          }
      );
    });
    }, 200)
  };

  function updateRole(){
    var employees = [];
    connection.query(`SELECT name as "Department", e.id, CONCAT (e.first_name," ", e.Last_name) AS "Name", title, salary, CONCAT (m.first_name," ", m.last_name) AS "Manager"
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id 
    INNER JOIN employee m ON e.manager_id = m.id;`, function(err, res) {
        if (err) throw err;
        employees = res;
      });
      var roles = [];
      connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        roles = res;
      });
      setTimeout(function afterTwoSeconds() {
        inquirer
        .prompt([
          {
            type: "list",
            name: "empName",
            message: "Select employee",
            choices: function(){
                var emp = []
                for (i=0; i<employees.length; i++){
                    emp.push(employees[i].Name)
                    }
                    return emp;
            }
          },
          {
            type: "list",
            name: "roleName",
            message: "Select employee new role",
            choices: function(){
                var titles = []
                for (i=0; i<roles.length; i++){
                    titles.push(roles[i].title)
                    }
                    return titles;
            }
          },
        ])
        .then(function (answer) {
          //const Item = [answer.itemName, answer.itemBid];
          console.log("Updating employee role...\n");
          var empID = 0;
          for (i=0;i<employees.length; i++){
              if (employees[i].Name == answer.empName){
                  empID=i;
              }
          }
          
          var rolID = 0;
          for (i=0; i<roles.length; i++){
              if (roles[i].title==answer.roleName){
                  rolID=i;
              }
          }
          
          var query = connection.query(
            `UPDATE employee SET role_id =${roles[rolID].id} WHERE id =${employees[empID].id};`,
            function (err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " item inserted!\n");
              // Call updateProduct AFTER the INSERT completes
             viewAll();
            }
          );
    
        }); 
    }, 200)
  };