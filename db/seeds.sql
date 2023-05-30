INSERT INTO department (department_name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finace"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer ", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 125000, 3),
        ("Legal Team Lead", 250000, 4),
        ("Lawyer", 190000, 4);

INSERT INTO employee (role_id, first_name, last_name, manager_id)
VALUES  (1, "Johne", "Doe", null),
        (2, "Mike", "Chan", 1 ),
        (3, "Ashely", "Rodriguez", null),
        (4, "Kevin", "Tupik", 3),
        (5, "Kunal", "Singh", null),
        (6, "Malia", "Brown", 5),
        (7, "Sarah", "Lourd", null),
        (8, "Tom", "Allen", 7);