INSERT INTO department (names) VALUES 
( 'Sales'), 
( 'Engineering'),
( 'Finance'),
( 'Legal');

INSERT INTO roles (title, salary, department_id) VALUES 
('Salesperson', 80000, 1), 
('Lead Engineer', 150000, 2), 
('Software Engineer', 120000, 2), 
('Account Manager', 160000, 3), 
('Accountant', 125000, 3), 
('Legal Team Lead', 250000, 4), 
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Jon', 'Smith', 1, 1), 
('Liam', 'Johnson', 4, 2), 
('Sophia', 'Williams', 3, 3), 
('Ethan', 'Brown', 2, 4),
('Olivia', 'Jones', 1, 5);
