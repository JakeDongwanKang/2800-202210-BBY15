"use strict";

const express = require('express');
const session = require("express-session");
const mysql = require("mysql2");
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require('jsdom');
const multer = require("multer");

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

// //default
// app.use(fileUpload());


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
    if (req.session.loggedIn) {
        let doc = fs.readFileSync("./app/html/main.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        let profile_jsdom = new JSDOM(doc);
        profile_jsdom.window.document.getElementById("header-name").innerHTML = "<h5 class='um-subtitle'> Hello " + req.session.firstName + ". Welcome to</h5>";
        res.write(profile_jsdom.serialize());
        res.end();

    } else {
        res.redirect("/");
    }

});


//Redirect admin users to the admin dashboard page if they have logged in. Otherwise, redirect to login page.
app.get("/dashboard", function (req, res) {
    if (req.session.loggedIn) {
        let doc = fs.readFileSync("./app/html/dashboard.html", "utf8");
        res.setHeader("Content-Type", "text/html");
        let profile_jsdom = new JSDOM(doc);
        profile_jsdom.window.document.getElementById("header-name").innerHTML = "<h5 class='um-subtitle'> Welcome " + req.session.firstName + "</h5>";
        res.write(profile_jsdom.serialize());
        res.end();
    } else {
        res.redirect("/");
    }

});

//function needed for redirecting to manage users lists in dahboard
app.get("/user-list", function (req, res) {
    if (req.session.loggedIn) {
        let doc = fs.readFileSync("./app/html/user-list.html", "utf8");
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
                req.session.user_id = results[0].user_id;
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
                req.session.loggedIn = true;
                req.session.firstName = req.body.firstName;
                req.session.email = req.body.email;
                req.session.save(function (err) {});
            });
        connection.end();
    }
});

async function getdata(callback) {
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'COMP2800'
    });
    connection.connect();
    connection.query(
        "SELECT * FROM BBY_15_User where",
        function (error, results, fields) {
            if (results.length > 0) {
                return callback(results);
            }
        }
    )
};


//Get the user 's information from the database
app.get("/profile", function (req, res) {
    // check to see if the user email and password match with data in database
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800"
    });
    let email = req.session.email;
    // check for a session first!
    if (req.session.loggedIn) {
        connection.connect();
        connection.query(
            "SELECT * FROM BBY_15_User WHERE user_id = ?",
            [req.session.user_id],
            function (error, results, fields) {
                let profile = fs.readFileSync("./app/html/profile.html", "utf8");
                let profileDOM = new JSDOM(profile);
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        let firstname = results[i].first_name;
                        let lastname = results[i].last_name;
                        let useremail = results[i].email;
                        let password = results[i].user_password;
                        let userprofile = results[i].profile;
                        var template = `   
                        </br>  
                        <div class="account-body"> 
                        <div class='profile-pic-div'>
                        <img class='profile-pic' src='${userprofile}'</div>
                            <div id="user_title">
                            <h2>${firstname} ${lastname} </h2>
                            </div>
                            <div id="user_content">
                                <div class="form-group">
                                    <label for="firstName">First Name</label>
                                    <input type="text" class="um-input" id="firstName" placeholder=${firstname}>
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Last Name</label>
                                    <input type="text" class="um-input" id="lastName" placeholder=${lastname}>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" class="um-input" id="userEmail" placeholder=${useremail}>
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" class="um-input" id="userPassword" placeholder=${password}>
                                </div>
                                
                            </div>  
                        </div>
                    `;
                        let area = profileDOM.window.document.querySelector('#user_content');
                        area.innerHTML += template;
                    }
                    res.send(profileDOM.serialize());
                }
            }
        )
        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
    } else {
        res.redirect("/");
    }
});


// //Request to change the update
// app.post("/profile", function (req, res) {
//     res.setHeader('Content-Type', 'application/json');

//     //Authenticating user.
//     let connection = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'COMP2800'
//     });

//     //connecting to the database, then creating and adding the user info into the database.
//     connection.connect();
//     connection.query('UPDATE BBY_15_User SET first_name=?, last_name=?, email=?, user_password=? WHERE user_id=?',
//         [req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.session.user_id],
//         function (error, results, fields) {
//             res.send({
//                 status: "success",
//                 msg: "Record added."
//             });
//             req.session.loggedIn = true;
//             req.session.firstName = req.body.firstName;
//             req.session.email = req.body.email;
//             req.session.save(function (err) {});
//         });
//     connection.end();
// });



const storage_avatar = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./app/images/avatar/")
    },
    filename: function (req, file, callback) {
        callback(null, req.session.user_id + "AT" + Date.now() + "AND" + file.originalname.split('/').pop().trim());
    }
});
const uploadAvatar = multer({
    storage: storage_avatar
});

//Store user update information and avatar
app.post("/profile", function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    //Authenticating user.
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'COMP2800'
    });

    //connecting to the database, then creating and adding the user info into the database.
    connection.connect();
    connection.query('UPDATE BBY_15_User SET first_name=?, last_name=?, email=?, user_password=? WHERE user_id=?',
        [req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.session.user_id],
        function (error, results, fields) {
            res.send({
                status: "success",
                msg: "Record added."
            });
            req.session.loggedIn = true;
            req.session.firstName = req.body.firstName;
            req.session.email = req.body.email;
            req.session.save(function (err) {});
        });
    connection.end();
});


app.post('/upload-avatar', uploadAvatar.array("files"), function (req, res) {
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'COMP2800'
    });
    connection.connect();

    for (let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
        console.log(req.files[i].path);
        connection.query('INSERT INTO BBY_15_Post_Images (post_id, image_location) VALUES (?, ?)',
            [req.session.postID, req.files[i].path],
            function (error, results, fields) {
                res.send({
                    status: "success",
                    msg: "Image information added to database."
                });
                req.session.save(function (err) {});
            });
    }


    // connection.end();

});



// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "./app/images/avatar/")
//     },
//     filename: function (req, file, callback) {
//         // callback(null, file.originalname.split('/').pop().trim());
//         callback(null, req.session.user_id + 'AT' + Date.now() + "AND" + file.originalname.split('/').pop().trim());

//     }
// });

// //Set storage engine

// const upload = multer({
//     storage: storage
// });
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         console.log(file.mimetype)
//         if (file.mimetype === 'assets/jpeg' ||
//             file.mimetype === 'assets/jpg' ||
//             file.mimetype === 'assets/png' ||
//             file.mimetype === 'assets/gif') {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             req.fileError = 'File format is not valid';
//         }
//     }
// })



// app.post('/upload-images', upload.array("files"), function (req, res) {

//     // const connection = mysql.createConnection({
//     //     host: 'localhost',
//     //     user: 'root',
//     //     password: '',
//     //     database: 'COMP2800'
//     // });

//     for (let i = 0; i < req.files.length; i++) {
//         req.files[i].filename = req.files[i].originalname;
//     }

// });

// app.post('/upload-images', (req, res) => {
//     let sampleFile;
//     let uploadPath;
//     if (!req.file || Object.keys(req.files).length === 0) {
//         return res.status(400).send('No files were uploaded.');
//     }
//     sampleFile = req.files.sampleFile;
//     console.log(sampleFile);

// });



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

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log('Listening on port ' + port + '!');
});