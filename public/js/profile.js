/**
 * Send data from client side to server for authentication.
 * Otherwise, send an error message to user. 
 * @author Arron_Ferguson (1537 instructor), Anh Nguyen (BBY15)
 * @param {*} data user input
 */

"use strict";
//Hambuger menu
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

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
        } else {
            window.location.reload();
        }
    } catch (error) {}
}

//Send the update information of users to server for authentication
document.getElementById("updateAccount").addEventListener("click", function (e) {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassword").value;

    if (!firstName || !lastName || !email || !password) {
        document.getElementById("emptyError").innerHTML = "<small>*Every column has to be filled*</small>";
    } else {
        sendData({
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("userEmail").value,
            password: document.getElementById("userPassword").value
        });
    }
});

// Go to main page when user clicks on "Cancel"
document.getElementById("cancel").addEventListener("click", function (e) {
    window.location.replace("/main");
})

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
        .then(function (res) {}).catch(function (err) {
            ("Error:", err)
        });
};