"use strict";

/**
 * I found how to do the toggleButton on 1537 course and 1800 course. 
 * I found some syntax and codes on this website that I can use to create a hambuger menu.
 * https://www.educba.com/hamburger-menu-javascript/
 */
 const toggleButton = document.getElementsByClassName('toggle-button')[0]
 const navbarLinks = document.getElementsByClassName('navbar-links')[0]
 
 toggleButton.addEventListener('click', () => {
     navbarLinks.classList.toggle('active')
 })

/**
 * Sends the user data from the client side to the server side for authentication.
 * If admin puts in a valid information in the add user page columns, adding user is complete, then gets redirected to the log-in page.
 * If not, admin receives an error message.
 * @author Arron_Ferguson (1537 instructor), Dongwan_Kang (BBY15)
 * @param {*} data admin input
 */

//Send data to server, then either create or execute an error message.
async function sendData(data) {
    try {
        let responseObject = await fetch("/add-user-as-admin", {
            method: 'POST',
            headers: { "Accept": 'application/json',
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
            window.location.replace("/dashboard");
        }
    } catch(error) {}
}


//Send user's email and password to server for authentication
document.getElementById("signUpButton").addEventListener("click", function(e) {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassword").value;

    if(!firstName || !lastName || !email || !password){
    document.getElementById("emptyError").innerHTML = "<small>*Every column has to be filled*</small>";
    } else {
    sendData({firstName: document.getElementById("firstName").value.trim(),
              lastName: document.getElementById("lastName").value.trim(),
              email: document.getElementById("userEmail").value.trim(),
              password: document.getElementById("userPassword").value.trim()
            });
        }
});

//This function removes the error message once one of the columns are clicked.
function removeErrorMsg() {
    document.getElementById("emptyError").innerHTML = "";
    document.getElementById("signUpButton").style.disabled = true;
}

// Go to dashboard when user clicks on "Cancel"
document.getElementById("cancel").addEventListener("click", function (e) {
    window.location.replace("/dashboard");
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
    togglePasswords[i].addEventListener('click', function (e) {
        const password = e.target.previousElementSibling;
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });
}