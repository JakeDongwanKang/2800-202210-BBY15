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
            headers: { "Accept": 'application/json',
                       "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if(parsedJSON.status == "fail") {
            document.getElementById("emptyError").innerHTML = "<small>*Every column has to be filled*</small>";
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
    sendData({firstName: document.getElementById("firstName").value,
              lastName: document.getElementById("lastName").value,
              email: document.getElementById("userEmail").value,
              password: document.getElementById("userPassword").value
            });
        }
});

//This function removes the error message once one of the columns are clicked.
function removeErrorMsg() {
    document.getElementById("emptyError").innerHTML = "";
}