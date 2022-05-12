"use strict";

const express = require('express');
const session = require("express-session");
const mysql = require("mysql2");
const app = express();
const fs = require("fs");
const { JSDOM } = require('jsdom');
const e = require('express');

app.use("/assets", express.static("./public/assets"));
app.use("/css", express.static("./public/css"));
app.use("/js", express.static("./public/js"));

app.use(session({
    secret: "what is the point of this secret",
    name: "extremisSessionID",
    resave: false,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


/**
 * Redirect users to main page if they have logged in and are not admin.
 * Redirect users to admin dashboard page if they have logged in and are admin.
 * Otherwise, redirect users to login page.
 */
app.get('/', function (req, res) {
    if (req.session.loggedIn && !req.session.isAdmin) {
        // if user has logged in and is not an admin, redirect to main page
        res.redirect("/main");
    } else if (req.session.loggedIn && req.session.isAdmin) {
        // if user has logged in and is an admin, redirect to main page
        res.redirect("/dashboard");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");

        res.set("Server", "Extremis");
        res.set("X-Powered-By", "BBY15");
        res.send(doc);
    }

});


//Redirect users to the main page if they have logged in. Otherwise, redirect to login page.
app.get("/main", function (req, res) {
    if (req.session.loggedIn && !req.session.isAdmin) {
        let doc = fs.readFileSync("./app/html/main.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        let main_jsdom = new JSDOM(doc);
        main_jsdom.window.document.getElementById("header-name").innerHTML = "<h5 class='um-subtitle'> Hello " + req.session.firstName + ". Welcome to</h5>";
        res.write(main_jsdom.serialize());
        res.end();
    } else {
        res.redirect("/");
    }

});

//Redirect admin users to the admin dashboard page if they have logged in. Otherwise, redirect to login page.
app.get("/dashboard", function (req, res) {
    if (req.session.loggedIn && req.session.isAdmin) {
        let doc = fs.readFileSync("./app/html/dashboard.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        let dashboard_jsdom = new JSDOM(doc);
        dashboard_jsdom.window.document.getElementById("header-name").innerHTML = "<h5 class='um-subtitle'> Welcome " + req.session.firstName + "</h5>";
        res.write(dashboard_jsdom.serialize());
        res.end();
    } else {
        res.redirect("/");
    }
});

app.get("/add-user", function (req, res) {
    if (req.session.loggedIn && req.session.isAdmin) {
        let doc = fs.readFileSync("./app/html/add-user.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        let dashboard_jsdom = new JSDOM(doc);
        res.write(dashboard_jsdom.serialize());
        res.end();
    } else {
        res.redirect("/");
    }

});

//function needed for getting list of all users in user-list
app.get("/user-list", function (req, res) {
    if (req.session.loggedIn) {
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "COMP2800"
        });

        let doc = fs.readFileSync("./app/html/user-list.html", "utf8");
        let user_list_jsdom = new JSDOM(doc);
        res.setHeader("Content-Type", "text/html");

        connection.query(
            "SELECT * FROM BBY_15_User",
            function(error, results, fields) {
                
                let user_list = `<tr>
                <th class="id_header">ID</th>
                <th class="first_name_header">First Name</th>
                <th class="last_name_header">Last Name</th>
                <th class="email_header">Email</th>
                <th class="password_header">Password</th>
                <th class="admin_header">Role</th>
                <th class="delete_header">Delete</th>
                </tr>`;
                for (let i = 0; i < results.length; i++) {
                    if (results[i]['admin_role']) {
                        var role = 'Admin';
                        var buttonText = 'Make User';
                        var classText = '_make_user';
                    } else {
                        var role = 'User';
                        var buttonText = 'Make Admin';
                        var classText = '_make_admin';
                    }
                    user_list += ("<tr><td class='id'>" + results[i]['user_id']
                    + "</td><td class='first_name'><span>" + results[i]['first_name']
                    + "</span></td><td class='last_name'><span>" + results[i]['last_name']
                    + "</span></td><td class='email'><span>" + results[i]['email']
                    + "</span></td><td class='password'><span>" + results[i]['user_password']
                    + "</span></td><td class='role'>" + "<button type='button' class='role_switch" + classText + "'>" + buttonText
                    + "</button></td><td class='delete'>" + "<button type='button' class='deleteUser'>Delete"
                    + "</button></td></tr>"
                    );
                }
                user_list_jsdom.window.document.getElementById("user-container").innerHTML = user_list;
                res.write(user_list_jsdom.serialize());
                res.end;
            }
        )
    } else {
        // if user has not logged in, redirect to login page
        res.redirect("/");
    }
});

app.get("/edit", function(req, res) {
    if(req.session.loggedIn && req.session.isAdmin) {
        let doc = fs.readFileSync("./app/html/edit.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        let dashboard_jsdom = new JSDOM(doc);
        // dashboard_jsdom.window.document.getElementById("header-name").innerHTML = "<h5 class='um-subtitle'> Welcome " + req.session.firstName + "</h5>";
        res.write(dashboard_jsdom.serialize());
        res.end();
    } else {
        res.redirect("/");
    }
})

// function for getting all admins for admin-list
app.get("/admin-list", function (req, res) {
    if (req.session.loggedIn) {
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "COMP2800"
        });

        let doc = fs.readFileSync("./app/html/admin-list.html", "utf8");
        let admin_list_jsdom = new JSDOM(doc);
        res.setHeader("Content-Type", "text/html");

        connection.query(
            "SELECT * FROM BBY_15_User WHERE admin_role = 1",
            function(error, results, fields) {
                
                let admin_list = `<tr>
                <th class="id_header"><span>ID</span></th>
                <th class="first_name_header"><span>First Name</span></th>
                <th class="last_name_header"><span>Last Name</span></th>
                <th class="email_header"><span>Email</span></th>
                <th class="password_header"><span>Password</span></th>
                <th class="delete_header"><span>Delete</span></th>
                </tr>`;
                for (let i = 0; i < results.length; i++) {
                    admin_list += ("<tr><td class='id'>" + results[i]['user_id']
                    + "</td><td class='first_name'><span>" + results[i]['first_name']
                    + "</span></td><td class='last_name'><span>" + results[i]['last_name']
                    + "</span></td><td class='email'><span>" + results[i]['email']
                    + "</span></td><td class='password'><span>" + results[i]['user_password']
                    + "</span></td><td class='delete'>" + "<button type='button' id='deleteUser'>Delete"
                    + "</button></td></tr>"
                    );
                }
                admin_list_jsdom.window.document.getElementById("user-container").innerHTML = admin_list;
                res.write(admin_list_jsdom.serialize());
                res.end;
            }
        )
    } else {
        // if user has not logged in, redirect to login page
        res.redirect("/");
    }
});

//function needed for redirecting to manage admins list in dashboard
app.get("/admin-list", function (req, res) {
    if (req.session.loggedIn) {
        let doc = fs.readFileSync("./app/html/admin-list.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        res.send(doc);
    } else {
        // if user has not logged in, redirect to login page
        res.redirect("/");
    }

});

//function needed for redirecting into the sign-up page.
app.get("/sign-up", function (req, res) {
    let doc = fs.readFileSync("./app/html/sign-up.html", "utf8");
    res.setHeader("Content-Type", "text/html");
    res.send(doc);
});

//Authenticate user
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    // check to see if the user email and password match with data in database
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800"
    });

    let email = req.body.email;
    let pwd = req.body.password;

    connection.execute(
        "SELECT * FROM BBY_15_User WHERE email = ? AND user_password = ?",
        [email, pwd],
        function (error, results, fields) {

            if (results.length > 0) {
                // user authenticated, create a session
                req.session.loggedIn = true;
                req.session.firstName = results[0].first_name;
                req.session.email = email;
                req.session.isAdmin = results[0].admin_role;
                if (results[0].admin_role) {
                    res.send({
                        status: "success",
                        msg: "Logged in.",
                        isAdmin: true
                    });

                } else {
                    res.send({
                        status: "success",
                        msg: "Logged in.",
                        isAdmin: false
                    });
                }
                req.session.save(function (err) {
                    //session saved
                });

            } else {
                res.send({
                    status: "fail",
                    msg: "User account not found."
                });
            }
            connection.end();

        }
    );
});

//Authenticating user, checks if they can be added to the database, then creates and add the user info into the database.
app.post("/add-user", function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    //Authenticating user.
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'COMP2800'
    });

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let signupemail = req.body.email;
    let signuppassword = req.body.password;

    //Checking to see if any columns in the sign-up page is NULL : if they are, the account cannot be made.
    if (!firstName || !lastName || !signupemail || !signuppassword) {
        res.send({
            status: "fail",
            msg: "Every column has to be filled."
        });
    } else {
        //connecting to the database, then creating and adding the user info into the database.
        connection.connect();
        connection.query('INSERT INTO BBY_15_User (first_name, last_name, email, user_password) VALUES (?, ?, ?, ?)',
            [req.body.firstName, req.body.lastName, req.body.email, req.body.password],
            function (error, results, fields) {
                res.send({
                    status: "success",
                    msg: "Record added."
                });
                req.session.firstName = req.body.firstName;
                req.session.lastName = req.body.lastName;
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.loggedIn = true;
                req.session.save(function (err) {});
            });
        connection.end();
    }
});

/**
 * Anh added the logout function
 * I learned how to write do it from Arron course (Comp1537).
 * These codes provided by Arron on his examples.
 */
app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out");
            } else {
                res.redirect("/");
            }
        });
    }
});

// ANOTHER POST: we are changing stuff on the server!!!
app.post('/update-user', function (req, res) {
    console.log("we made it");
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('UPDATE BBY_15_User SET first_name = ?, last_name = ?, email = ?, user_password = ? WHERE user_id = ?',
          [req.body.firstName, req.body.lastName, req.body.email, req.body.password, parseInt(req.body.id)],
          function (error, results, fields) {
      if (error) {
          console.log(error);
      }
      //console.log('Rows returned are: ', results);
      res.send({ status: "success", msg: "Recorded updated." });
    });
    connection.end();
});

// POST: we are changing stuff on the server!!!
app.post('/delete-user', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    // NOT WISE TO DO, BUT JUST SHOWING YOU CAN
    connection.query('DELETE FROM BBY_15_User WHERE user_id = ?',
        [parseInt(req.body.id)],
        function (error, results, fields) {
      if (error) {
          console.log(error);
      }
      //console.log('Rows returned are: ', results);
      res.send({ status: "success", msg: "Recorded deleted." });

    });
    connection.end();
});

app.post('/make-user', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    // NOT WISE TO DO, BUT JUST SHOWING YOU CAN
    connection.query('UPDATE BBY_15_User SET admin_role = false WHERE user_id = ?',
        [parseInt(req.body.id)],
        function (error, results, fields) {
      if (error) {
          console.log(error);
      }
      //console.log('Rows returned are: ', results);
      res.send({ status: "success", msg: "Recorded deleted." });

    });
    connection.end();
});

app.post('/make-admin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    // NOT WISE TO DO, BUT JUST SHOWING YOU CAN
    connection.query('UPDATE BBY_15_User SET admin_role = true WHERE user_id = ?',
        [parseInt(req.body.id)],
        function (error, results, fields) {
      if (error) {
          console.log(error);
      }
      //console.log('Rows returned are: ', results);
      res.send({ status: "success", msg: "Recorded deleted." });

    });
    connection.end();
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    
});