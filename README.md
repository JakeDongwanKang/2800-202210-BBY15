## Extremis

* [Team](#team)
* [Technologies](#technologies)
* [Overview](#overview)
* [Contents](#content)
* [Guide](#guide)

## Team 
The team BBY15 is made up of 4 students in the BCIT Computer Systems Technology Diploma program
- Vincent Lam (CST Term 2)
- Jake Dongwan (CST Term 2)
- Anh Nguyen (CST Term 1)
- Linh Nguyen (CST Term 1)
	
## Technologies
This Extremis app is made possible because of amazing people that created:
* HTML5, CSS
* Node.js for allow us to use Javascript on the server.
* Express.js for allowing us to easily write a server for our application.
* Heroku for allowing us to host our app for free.
* JavaScript for allowing us to implement complex features on web pages.
* TinyMCE for allowing us to use the editor free.
* OpenWeather API for allowing us to receive all essential weather data for a specific location by making only one API call.
* LocationIQ API for allowing us to access maps, nearby points of interest and nearby countries.
* Amazon S3 for allowing us to upload images.
* MySQL for for allowing us to have a database for free.

Thank you for making these resources free so it's possible for us to create applications with ease!

## Overview
How our repo is organized
* app - that holds all html files and images.
* public - that holds all of the static resources such as assets, css, and javascript files.

## Test Plan
- Tests on the website were done by checking database values after logins and registrations.
- Tests were run manually on each page to check if each scene worked with all of its objects.
- A list of tests done were done
Click [here](https://docs.google.com/spreadsheets/d/1onjpp5LQvqqrM0Xsta7xTYl7vPLh-7MX15hi9F9XHmE/edit#gid=394496370) for our test plan


## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── extremis-app             # server file
├── index.html
├── Procifile
├── package-lock.json
├── Package.json
└── README.md

It has the following subfolders and files:

├── public
|     ├── assets                     # Folder for images
|     ├── css                        # Folder for styles    
|     └── js                         # Folder for scripts
|
├── app
      ├── html                       # Folder for pages      
      └── images 
            ├── avatar               # Folder for avatar    
            └── post-images          # Folder for post images       


## Guide
- Download Node.js at [here](https://nodejs.org/en/download)
- Download Visual Studio Code or any text editor/IDE of your choice
- Copy our repository link [here](https://github.com/JakeDongwanKang/2800-202210-BBY15.git)
- Clone the repository onto your machine and in command line navigate to the repository
- Run the command `npm install express express-session mysql2`
- Run XAMPP and start mysql or you can use any mysql software
- Open the window command line and enter `mysql -u root -p`
- Set up database by following these codes:
    ``CREATE DATABASE IF NOT EXISTS COMP2800;
    USE COMP2800;

    CREATE TABLE IF NOT EXISTS BBY_15_User (
    user_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(25) NOT NULL,
    last_name varchar(25) NOT NULL,
    email varchar(45) UNIQUE NOT NULL,
    user_password varchar(25) NOT NULL,
    profile_picture varchar(150),
    admin_role boolean NOT NULL,
    join_date datetime,
    num_posts int,
    PRIMARY KEY (user_id));

    CREATE TABLE IF NOT EXISTS BBY_15_Post (
    post_id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    posted_time datetime NOT NULL,
    post_content varchar(5000) NOT NULL,
    post_title varchar(150) NOT NULL,
    post_type varchar(40) NOT NULL,
    location varchar(60),
    post_status varchar(10) NOT NULL,
    weather_type varchar(20),
    PRIMARY KEY (post_id));

    CREATE TABLE IF NOT EXISTS BBY_15_Post_Images (
    image_id int NOT NULL AUTO_INCREMENT,
    post_id int NOT NULL,
    image_location varchar(150),
    PRIMARY KEY (image_id),
    FOREIGN KEY (post_id) REFERENCES BBY_15_Post(post_id) ON DELETE CASCADE);

    INSERT INTO BBY_15_User (first_name, last_name, email, user_password, admin_role, join_date, num_posts) VALUES 
    ('Joe', 'Smith', 'joesmith@email.ca', 'password', FALSE, 20220503160135, 0),
    ('Admin', 'Admin', 'admin@email.ca', 'password', TRUE, 20220503160212, 0);

    INSERT INTO BBY_15_Post (user_id, posted_time, post_content, post_title, post_type, location, post_status, weather_type) VALUES
    (1, 20220516220604, "Bad weather here", "Weather", "weather condition", "Here", "approved", "Bad");``
- Run the web app locally by executing `extremis-app.js` in command line
- Open a web browser (Firefox or Chrome is recommended)
- Go to the http://localhost:8000 to view the app
- App may be hosted by the user in any way they wish, we used [Heroku](https://devcenter.heroku.com/articles/deploying-nodejs) and set our GitHub repo to automatically deploy to Heroku. A guide to auto-deploying onto Heroku from GitHub can be found here


