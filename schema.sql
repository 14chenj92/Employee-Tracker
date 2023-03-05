DROP DATABASE IF EXISTS sample_db;
CREATE DATABASE sample_db;

USE sample_db;

CREATE TABLE department (
  id INT PRIMARY KEY,
  name_ VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT
);

CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT
);