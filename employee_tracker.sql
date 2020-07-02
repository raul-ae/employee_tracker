DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT not null,
  name varchar(30) not null,
  PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id)
);
CREATE TABLE employee (
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
PRIMARY KEY (id)
);

INSERT INTO department (id, name) VALUES (111, "Sales");
INSERT INTO department (id, name) VALUES (222, "Marketing");
INSERT INTO department (id, name) VALUES (333, "Engineering");
INSERT INTO department (id, name) VALUES (444, "Finance");
INSERT INTO department (id, name) VALUES (555, "Manufacturing");
SELECT * FROM department;

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Raul", "Alarcon",3339,2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Scott", "Boss",3339,6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Juan", "Ganzalez",3338,1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Pedro", "Perez",3336,3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Sandra", "Diaz",3335,3);
SELECT * FROM employee;

INSERT INTO role (id, title, salary, department_id) VALUES (3335,"Engineer Level-1",28000,333);
INSERT INTO role (id, title, salary, department_id) VALUES (3336,"Engineer Level-2",35000,333);
INSERT INTO role (id, title, salary, department_id) VALUES (3337,"Engineer Level-3",45000,333);
INSERT INTO role (id, title, salary, department_id) VALUES (3338,"Engineering Supervisor",55000,333);
INSERT INTO role (id, title, salary, department_id) VALUES (3339,"Engineering Manager",80000,333);
INSERT INTO role (id, title, salary, department_id) VALUES (1115,"Sales Rep Level-1",28000,111);
INSERT INTO role (id, title, salary, department_id) VALUES (1116,"Sales Rep Level-2",48000,111);
INSERT INTO role (id, title, salary, department_id) VALUES (1117,"Sales Rep Level-3",58000,111);
INSERT INTO role (id, title, salary, department_id) VALUES (1118,"Sales Manager",68000,111);
INSERT INTO role (id, title, salary, department_id) VALUES (1119,"Sales Director",78000,111);
INSERT INTO role (id, title, salary, department_id) VALUES (4445,"Finance Analyst Level-1",28000,444);
INSERT INTO role (id, title, salary, department_id) VALUES (4446,"Finance Analyst Level-2",48000,444);
INSERT INTO role (id, title, salary, department_id) VALUES (4447,"Finance Analyst Level-3",58000,444);
INSERT INTO role (id, title, salary, department_id) VALUES (4448,"Finance Manager",68000,444);
INSERT INTO role (id, title, salary, department_id) VALUES (4449,"Finance Director",88000,444);
INSERT INTO role (id, title, salary, department_id) VALUES (2225,"Marketing Analyst Level-1",28000,222);
INSERT INTO role (id, title, salary, department_id) VALUES (2226,"Marketing Analyst Level-2",48000,222);
INSERT INTO role (id, title, salary, department_id) VALUES (2227,"Marketing Analyst Level-3",58000,222);
INSERT INTO role (id, title, salary, department_id) VALUES (2228,"Marketing Manager",68000,222);
INSERT INTO role (id, title, salary, department_id) VALUES (2229,"Marketing Director",88000,222);
INSERT INTO role (id, title, salary, department_id) VALUES (5555,"Manufacturing Analyst Level-1",28000,555);
INSERT INTO role (id, title, salary, department_id) VALUES (5556,"Manufacturing Analyst Level-2",48000,555);
INSERT INTO role (id, title, salary, department_id) VALUES (5557,"Manufacturing Analyst Level-3",58000,555);
INSERT INTO role (id, title, salary, department_id) VALUES (5558,"Manufacturing Manager",68000,555);
INSERT INTO role (id, title, salary, department_id) VALUES (5559,"Manufacturing Director",88000,555);
SELECT * FROM role;

SELECT first_name, last_name, title, salary
FROM employee
LEFT JOIN role ON employee.role_id = role.id; 

SELECT e.first_name, e.last_name, 
CONCAT (m.first_name," ", m.last_name) AS "Manager"
FROM employee e
INNER JOIN employee m ON e.manager_id = m.id;

SELECT e.id, e.first_name, e.Last_name, title, name, salary, CONCAT (m.first_name," ", m.last_name) AS "Manager"
FROM employee e
LEFT JOIN role ON e.role_id = role.id 
LEFT JOIN department on role.department_id = department.id 
INNER JOIN employee m ON e.manager_id = m.id;