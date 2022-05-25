"use strict";

/**
 * Sends the user data from the client side to the server side for authentication.
 * If user puts in a valid information in the signup page columns, sign-up is complete, then gets redirected to the log-in page.
 * If not, user receives an error message.
 * @author Arron_Ferguson (1537 instructor), Dongwan_Kang (BBY15)
 * @param {*} data user input
 */

//Send data to server, then either create or execute an error message.
async function sendData(data) {
    try {
        let responseObject = await fetch("/add-user", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if (parsedJSON.status == "fail") {
            document.getElementById("emptyError").innerHTML = "<small>*Every column has to be filled*</small>";
        } else if (parsedJSON.status == "duplicate") {
            document.getElementById("emptyError").innerHTML = "<small>*This email is already registered to an account*</small>";
        } else if (parsedJSON.status == "invalid email") {
            document.getElementById("emptyError").innerHTML = "<small>*Invalid email address*</small>";
        } else {
            window.location.replace("/main");
        }
    } catch (error) {}
}


//Send user's email and password to server for authentication
document.getElementById("signUpButton").addEventListener("click", function (e) {
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("userEmail").value.trim();
    let password = document.getElementById("userPassword").value.trim();
    let confirmed_password = document.getElementById('userConfirmPassword').value.trim();

    if (!firstName || !lastName || !email || !password || !confirmed_password) {
        document.getElementById("emptyError").innerHTML = "<small>*Every column has to be filled*</small>";
    } else {
        sendData({
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("userEmail").value.trim(),
            password: document.getElementById("userPassword").value.trim()
        });
    }
});

//This function removes the error message once one of the columns are clicked.
function removeErrorMsg() {
    document.getElementById("emptyError").innerHTML = "";
}

// Go to sign-up when user clicks on "Login Now!"
document.getElementById("log-in-link").addEventListener("click", function (e) {
    window.location.replace("/");
})

//Function to check the password is matched or not made by Anh
function validate_password() {
    var pass = document.getElementById('userPassword').value.trim();
    var confirm_pass = document.getElementById('userConfirmPassword').value.trim();
    if (pass != confirm_pass) {
        document.getElementById('wrong_pass_alert').style.color = 'red';
        document.getElementById('wrong_pass_alert').innerHTML = '☒ Please enter the same password';
        document.getElementById('signUpButton').disabled = true;
        document.getElementById('signUpButton').style.opacity = (0.4);
    } else {
        document.getElementById('wrong_pass_alert').style.color = 'green';
        document.getElementById('wrong_pass_alert').innerHTML =
            '🗹 Password Matched';
        document.getElementById('signUpButton').disabled = false;
        document.getElementById('signUpButton').style.opacity = (1);
    }
}

// Display/Hide password (https://www.csestack.org/hide-show-password-eye-icon-html-javascript/)
var togglePasswords = document.querySelectorAll('.togglePassword');
for (let i = 0; i < togglePasswords.length; i++) {
    console.log(togglePasswords[i]);
    togglePasswords[i].addEventListener('click', function (e) {
        const password = e.target.previousElementSibling;
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });
}