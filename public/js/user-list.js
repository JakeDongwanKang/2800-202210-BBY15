"use strict";

/**
 * We found how to do the toggleButton on 1537 course and 1800 course. 
 * We found some syntax and codes on this website that I can use to create a hambuger menu.
 * https://www.educba.com/hamburger-menu-javascript/
 */
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

/**
 * Sends the user data from the client side to the server side for authentication.
 * User clicks on the data that needs to be changed through the text box, and it changes on to the server side in real time
 * @author Arron_Ferguson (1537 instructor), Dongwan_Kang (BBY15)
 * @param {*} data user input
 */
async function sendData(data) {
    try {
        let responseObject = await fetch("/update-user", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if (parsedJSON.status == "invalid email") {
            document.getElementById("emptyError").innerHTML = `<small style="color:red;">*Invalid email address. Changes not saved*</small>`;
        } else if (parsedJSON.status == "success") {
            document.getElementById("emptyError").innerHTML = `<small style="color:green;">*Changes saved*</small>`;
        } else if (parsedJSON.status == "duplicate") {
            document.getElementById("emptyError").innerHTML = `<small style="color:red;">*Email already in use. Changes not saved*</small>`;
        }
    } catch (error) {}
}

//This for loop adds the event listener to every editing columns in the user list.
let records = document.getElementsByTagName("span");
for (let i = 0; i < records.length; i++) {
    records[i].addEventListener("click", editCell);
}

//This function helps the admin edit the Cell and get the values readied to send to the serer side.
function editCell(e) {
    let span_text = e.target.innerHTML;
    let parent = e.target.parentNode; //gets parent, so we know which user we're editing
    let text_box = document.createElement("input"); //creates the text box for accepting changes
    let regex = new RegExp("^[^.]+([p{L|M|N|P|S} ]*)+[^\.]@[^\.]+([p{L|M|N|P|S} ]*).+[^\.]$");

    text_box.value = span_text;
    text_box.addEventListener("keyup", function (e) {
        if (e.which == 13) { //recognize enter key
            let val = text_box.value;
            if (val === "") {
                let filled_box = document.createElement("span"); //creates the HTML for after done editing
                filled_box.addEventListener("click", editCell); //makes thing clickable for next time want to edit
                filled_box.innerHTML = span_text;
                parent.innerHTML = "<div class='material-icons'>edit</div>"; //clears parent node pointer except for edit icon
                parent.appendChild(filled_box);
                document.getElementById("emptyError").innerHTML = `<small style="color:red;">*Field cannot be empty. Changes not saved*</small>`;
            } else {
                let filled_box = document.createElement("span"); //creates the HTML for after done editing
                filled_box.addEventListener("click", editCell); //makes thing clickable for next time want to edit
                filled_box.innerHTML = val;
                parent.innerHTML = "<div class='material-icons'>edit</div>"; //clears parent node pointer except for edit icon
                parent.appendChild(filled_box);
                if (regex.test(parent.parentNode.querySelector(".email :nth-child(2)").innerHTML)) {
                    let dataToSend = {
                        id: parent.parentNode.querySelector(".id").innerHTML,
                        firstName: parent.parentNode.querySelector(".first_name :nth-child(2)").innerHTML.trim(),
                        lastName: parent.parentNode.querySelector(".last_name :nth-child(2)").innerHTML.trim(),
                        email: parent.parentNode.querySelector(".email :nth-child(2)").innerHTML.trim(),
                        password: parent.parentNode.querySelector(".password :nth-child(2)").innerHTML.trim()
                    };
                    sendData(dataToSend);
                } else {
                    document.getElementById("emptyError").innerHTML = `<small style="color:red;">*Invalid email address. Changes not saved*</small>`;
                    filled_box.innerHTML = span_text;
                }
            }
        }
    });
    parent.innerHTML = "";
    parent.appendChild(text_box);
}

//This function sends the data of the users from the client side to the server side so that it can be deleted from the database.
async function sendDataToDelete(e) {
    e.preventDefault();
    document.getElementById("warning-message").innerHTML = "The user will be permanantly deleted. This cannot be undone.";
    document.getElementById("confirm").innerHTML = "Delete";
    document.querySelector("#err-popup").style.display = "block";
    document.getElementById("confirm").addEventListener("click", async function () {
        let parent = e.target.parentNode;
        let dataToSend = {
            id: parent.parentNode.querySelector(".id").innerHTML
        };
        try {
            let responseObject = await fetch("/delete-user", {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            let parsedJSON = await responseObject.json();
            if (parsedJSON.status == "success") {
                parent.parentNode.remove();
            }
            document.querySelector("#err-popup").style.display = "none";
        } catch (error) {}
    })
}

//This for loop adds the event listeners to the delete user button
let deleteRecords = document.getElementsByClassName("deleteUser");
for (let i = 0; i < deleteRecords.length; i++) {
    deleteRecords[i].addEventListener("click", sendDataToDelete);
}

//This for loop adds the event listener to the Make user button
let makeUserRecords = document.getElementsByClassName("role_switch_to_user");
for (let i = 0; i < makeUserRecords.length; i++) {
    makeUserRecords[i].addEventListener("click", sendDataToMakeUser);
}

//This for loop adds the event listener to the Make Admin button
let makeAdminRecords = document.getElementsByClassName("role_switch_to_admin");
for (let i = 0; i < makeAdminRecords.length; i++) {
    makeAdminRecords[i].addEventListener("click", sendDataToMakeAdmin);
}

//This data sends the user data from the client side to the server side so that the specified admin user can become regular user.
async function sendDataToMakeUser(e) {
    e.preventDefault();
    document.getElementById("warning-message").innerHTML = "This user will lose admin privileges.";
    document.getElementById("confirm").innerHTML = "Make User";
    document.querySelector("#err-popup").style.display = "block";
    document.getElementById("confirm").addEventListener("click", async function () {
        let parent = e.target.parentNode;
        let dataToSend = {
            id: parent.parentNode.querySelector(".id").innerHTML
        };
        try {
            let responseObject = await fetch("/make-user", {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            let parsedJSON = await responseObject.json();
            if (parsedJSON.status == "success") {
                parent.parentNode.remove();
            }
            document.querySelector("#err-popup").style.display = "none";
        } catch (error) {}
    })
}

//This data sends the user data from the client side to the server side so that the specified regular user can become admin user.
async function sendDataToMakeAdmin(e) {
    e.preventDefault();
    document.getElementById("warning-message").innerHTML = "This user will have admin privileges.";
    document.getElementById("confirm").innerHTML = "Make Admin";
    document.querySelector("#err-popup").style.display = "block";
    document.getElementById("confirm").addEventListener("click", async function () {
        let parent = e.target.parentNode;
        let dataToSend = {
            id: parent.parentNode.querySelector(".id").innerHTML
        };
        try {
            let responseObject = await fetch("/make-admin", {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            let parsedJSON = await responseObject.json();
            if (parsedJSON.status == "success") {
                parent.parentNode.remove();
            }
            document.querySelector("#err-popup").style.display = "none";
        } catch (error) {}
    })
}

/**
 * If users click on "Cancel" button in popup message, hide the popup message so that users can edit all input.
 */
document.getElementById("cancel2").addEventListener("click", function () {
    document.querySelector("#err-popup").style.display = "none";
})