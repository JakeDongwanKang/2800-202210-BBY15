const express = require('express');
const session = require("express-session");
const app = express();
const fs = require("fs");


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


app.get('/', function (req, res) {
    if (req.session.loggedIn && !req.session.isAdmin) {
        // if user has logged in and is not an admin, redirect to main page
        res.redirect("/main");
    } else if (req.session.loggedIn && !req.session.isAdmin) {
        // if user has logged in and is an admin, redirect to main page
        res.redirect("/dashboard");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");

        res.set("Server", "Extremis");
        res.set("X-Powered-By", "BBY15");
        res.send(doc);
    }

});


app.get("/main", function (req, res) {
    if (req.session.loggedIn) {
        let doc = fs.readFileSync("./app/data/main.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        res.send(doc);
    } else {
        // if user has not logged in, redirect to login page
        res.redirect("/");
    }

});

app.get("/dashboard", function (req, res) {
    if (req.session.loggedIn) {
        let doc = fs.readFileSync("./app/data/dashboard.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        res.send(doc);
    } else {
        // if user has not logged in, redirect to login page
        res.redirect("/");
    }

});

//Authenticate user
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    console.log("What was sent", req.body.email, req.body.password); //Delete later

    // check to see if the user email and password match with data in database
    const mysql = require("mysql2");
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
            console.log("results: ", results);

            if (error) {
                console.log(error);
            }

            if (results.length > 0) {
                // user authenticated, create a session
                req.session.loggedIn = true;
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
                };
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
    )
})


// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log('Listening on port ' + port + '!');
});