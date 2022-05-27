/**
 * Send data from client side to server for authentication.
 * Otherwise, send an error message to user. 
 * @author Arron_Ferguson (1537 instructor), Anh Nguyen (BBY15)
 * @param {*} data user input
 */

"use strict";
//Hambuger menu
const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navbarLinks = document.getElementsByClassName('navbar-links')[0];

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});

//Send data to server, then either create or execute an error message.
async function sendData(data) {
    try {
        let responseObject = await fetch("/profile", {
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
        } else if (parsedJSON.status == "invalid email") {
            document.getElementById("emptyError").innerHTML = "<small>*Invalid email address*</small>";
        }
        else {
            window.location.reload();
        }
    } catch (error) {}
}

//Send the update information of users to server for authentication
document.getElementById("updateAccount").addEventListener("click", function () {
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("userEmail").value.trim();
    let password = document.getElementById("userPassword").value.trim();
    let confirmedPassword = document.getElementById('userConfirmPassword').value.trim();

    if (!firstName || !lastName || !email || !password || !confirmedPassword) {
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

// Go to main page when user clicks on "Cancel"
document.getElementById("cancel").addEventListener("click", function () {
    window.location.replace("/main");
});

// function to store imagines to the database
const upload_avatar = document.getElementById("upload-images");
upload_avatar.addEventListener("submit", uploadImages);

//Upload images to the system.
function uploadImages(e) {
    e.preventDefault();
    const imagesUpload = document.querySelector("#selectFile");
    const formData = new FormData();
    for (let i = 0; i < imagesUpload.files.length; i++) {
        formData.append("files", imagesUpload.files[i]);
    }
    const options = {
        method: 'POST',
        body: formData,
    };
    fetch("/upload-avatar", options)
        .then(function () {}).catch(function (err) {
            ("Error:", err);
        });
}

//Function to check the password is matched or not
function validate_password() {
    var pass = document.getElementById('userPassword').value.trim();
    var confirm_pass = document.getElementById('userConfirmPassword').value.trim();
    if (pass != confirm_pass) {
        document.getElementById('wrong_pass_alert').style.color = 'red';
        document.getElementById('wrong_pass_alert').innerHTML = '☒ Password are not matching';
        document.getElementById('updateAccount').disabled = true;
        document.getElementById('updateAccount').style.opacity = (0.4);
    } else {
        document.getElementById('wrong_pass_alert').style.color = 'green';
        document.getElementById('wrong_pass_alert').innerHTML =
            '🗹 Password Matched';
        document.getElementById('updateAccount').disabled = false;
        document.getElementById('updateAccount').style.opacity = (1);
    }
}


/**
 * Reset all field values as origin if users click on "Reset" button
 */
var oldFirstName = document.querySelector("#firstName").value;
var oldLastName = document.querySelector("#lastName").value;
var oldPassword = document.querySelector("#userPassword").value;

document.getElementById("reset").addEventListener("click", function () {
    document.querySelector("#firstName").value = oldFirstName;
    document.querySelector("#lastName").value = oldLastName;
    document.querySelector("#userPassword").value = oldPassword;
});

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