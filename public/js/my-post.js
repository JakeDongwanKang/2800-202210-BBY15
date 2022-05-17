"use strict";

//Humbeger menu
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

//Send the update of each post
async function sendData(data) {
    try {
        let responseObject = await fetch("/update-post", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if (parsedJSON.status == "success") {}
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
    text_box.value = span_text;
    text_box.addEventListener("keyup", function (e) {
        if (e.which == 13) { //recognize enter key
            let val = text_box.value;
            let filled_box = document.createElement("span"); //creates the HTML for after done editing
            filled_box.addEventListener("click", editCell); //makes thing clickable for next time want to edit
            filled_box.innerHTML = val;
            parent.innerHTML = ""; //clears parent node pointer
            parent.appendChild(filled_box);
            let dataToSend = {
                timePost: parent.parentNode.querySelector(".time_post").innerHTML,
                typeWeather: parent.parentNode.querySelector(".type_weather").innerHTML,
                titlePost: parent.parentNode.querySelector(".title_post").innerHTML,
                postLocation: parent.parentNode.querySelector(".post_location").innerHTML,
                descrip: parent.parentNode.querySelector(".description").innerHTML
            };
            sendData(dataToSend);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(text_box);
}

//This function sends the data of the users from the client side to the server side so that i can be deleted from the database.
async function sendDataToDelete(e) {
    e.preventDefault();
    let parent = e.target.parentNode;
    let dataToSend = {
        timePost: parent.parentNode.querySelector(".time_post").innerHTML
    };
    try {
        let responseObject = await fetch("/delete-post", {
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
    } catch (error) {}
}

//This for loop adds the event listeners to the delete user button
let deleteRecords = document.getElementsByClassName("deletePost");
for (let i = 0; i < deleteRecords.length; i++) {
    deleteRecords[i].addEventListener("click", sendDataToDelete);
}