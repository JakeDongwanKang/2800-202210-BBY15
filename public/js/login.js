"use strict";

/**
 * Send data from client side to server for authentication.
 * If user has an account and is an admin, redirect to Admin Dashboard.
 * If user has an account and is not an admin, redirect to the Main page.
 * Otherwise, send an error message to user. 
 * @author Arron_Ferguson (1537 instructor), Linh_Nguyen (BBY15)
 * @param {*} data user input
 */
async function sendData(data) {
    try {
        let responseObject = await fetch("/login", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if (parsedJSON.status == "fail") {
            document.getElementById("emailError").innerHTML = "<small>*Please check your email</small>";
            document.getElementById("passwordError").innerHTML = "<small>*Please check your password</small>";
        } else {
            if (parsedJSON.isAdmin) {
                //if user is an admin, redirect to the admin dashboard page
                window.location.replace("/dashboard");
            } else {
                //if user is not an admin, redirect to the main page
                window.location.replace("/main");
            }
        }
    } catch (error) {}
}

//Send user's email and password to server for authentication
document.getElementById("submit").addEventListener("click", function (e) {
    sendData({
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPassword").value
    });
});


//Removes the error message when user enters input.
function removeErrorMsg() {
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";
}

// Go to sign-up when user clicks on "Join Extremis now!"
document.getElementById("sign-up-link").addEventListener("click", function (e) {
    window.location.replace("/sign-up");
});

// Send data when user uses enter key
document.getElementById("userPassword").onkeydown = function (e){if (e.which == 13) {
    sendData({
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPassword").value
    });
}}
document.getElementById("userEmail").onkeydown = function (e){if (e.which == 13) {
    sendData({
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPassword").value
    });
}}


// Display/Hide password (https://www.csestack.org/hide-show-password-eye-icon-html-javascript/)
const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#userPassword');
 
  togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});
