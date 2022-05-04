CREATE DATABASE IF NOT EXISTS COMP2800;

CREATE TABLE IF NOT EXISTS BBY_15_User (
user_id int NOT NULL AUTO_INCREMENT,
first_name varchar(25) NOT NULL,
last_name varchar(25) NOT NULL,
email varchar(25) NOT NULL,
user_password varchar(25) NOT NULL,
profile_picture varchar(50),
admin_role boolean NOT NULL,
PRIMARY KEY (user_id));

INSERT INTO BBY_15_User (first_name, last_name, email, user_password, admin_role) VALUES 
('Joe', 'Smith', 'joesmith@email.ca', 'password', FALSE),
('Admin', 'Admin', 'admin@email.ca', 'password', TRUE);