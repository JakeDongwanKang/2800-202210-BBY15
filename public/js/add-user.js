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

// Go to dashboard when user clicks on "Cancel"
document.getElementById("cancel").addEventListener("click", function (e) {
    window.location.replace("/dashboard");
})