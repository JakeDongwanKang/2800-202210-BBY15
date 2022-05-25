/**
 * Send data from client side to server for authentication.
 * Otherwise, send an error message to user. 
 * @author Arron_Ferguson (1537 instructor), Anh Nguyen (BBY15)
 * @param {*} data user input
 */

"use strict";

//Humbeger menu
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

//Send the update of texts on each post
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

//This for loop adds the event listener to every editing columns in each post
let records = document.getElementsByTagName("span");
for (let i = 0; i < records.length; i++) {
    records[i].addEventListener("click", editCell);
}

//This function helps the user can edit the Cell and get the values readied to send to the serer side.
function editCell(e) {

    let span_text = e.target.innerHTML;
    let parent = e.target.parentNode; //gets parent, so we know which user we're editing
    e.target.remove();
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
                post_id: parent.parentNode.querySelector(".post_id").innerText,
                weather_type: parent.parentNode.querySelector(".weather_type").innerText.trim(),
                post_title: parent.parentNode.querySelector(".post_title").innerText.trim(),
                location: parent.parentNode.querySelector(".location").innerText.trim(),
            };
            sendData(dataToSend);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(text_box);
}


/**
 * Edit the post content.
 * We can not use the editCell() function to edit post content because the content text is formatted by the text editor in create-post
 * page, making it have html elements inside.
 */
var edit = true;
function editContent(e) {
    if (edit) {
        let oldValue = e.innerText;
        e.innerHTML = "<input class='new-content' value='" + oldValue + "'/>";
        let textBox = e.firstChild;
        edit = false;
        textBox.addEventListener("keyup", function (a) {
            if (a.keyCode == 13) {
                e.innerText = textBox.value;
                sendContent({
                    post_id: e.parentElement.children[0].innerText.trim(),
                    post_content: textBox.value.trim()
                });
            }
        })
    }
}

async function sendContent(data) {
    try {
        let responseObject = await fetch("/update-post-content", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if (parsedJSON.status == "success") {
        }
    } catch (error) {}
}

//This function sends the data of the users from the client side to the server side so that i can be deleted from the database.
//Delete whole post
async function sendDataToDelete(e) {
    e.preventDefault();
    let parent = e.target.parentNode;
    let dataToSend = {
        post_id: parent.parentNode.parentNode.querySelector(".post_id").innerText
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
            window.location.replace("/my-post")
        }
    } catch (error) {}
}

//This for loop adds the event listeners to the delete post button
let deleteRecords = document.getElementsByClassName("deletePost");
for (let i = 0; i < deleteRecords.length; i++) {
    deleteRecords[i].addEventListener("click", sendDataToDelete);
}


//This function sends the data of the users from the client side to the server side so that i can be deleted from the database.
//Delete an image among many images
async function sendDataToDeleteImage(e) {
    e.preventDefault();
    let parent = e.target.parentNode;
    let dataToSend = {
        // image: parent.querySelector(".image").getAttribute("src")
        image: e.target.nextElementSibling.getAttribute("src")
    };
    try {
        let responseObject = await fetch("/delete-image", {
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
            window.location.replace("/my-post")
        }
    } catch (error) {}
}

//This for loop adds the event listeners to the delete image button
let deleteImageRecords = document.getElementsByClassName("remove-icon");
for (let i = 0; i < deleteImageRecords.length; i++) {
    deleteImageRecords[i].addEventListener("click", sendDataToDeleteImage);
}

const upLoadForm = document.getElementById("upload-images");
upLoadForm.addEventListener("submit", sendDataToaddImage);
upLoadForm.addEventListener("submit", uploadImages);

async function uploadImages(e) {
    e.preventDefault();
    const imageUpload = document.querySelector('#selectFile');
    const formData = new FormData();
    for (let i = 0; i < imageUpload.files.length; i++) {
        // put the images from the input into the form data
        formData.append("files", imageUpload.files[i]);
    }
    let options = {
        method: 'POST',
        body: formData,
    };
    // now use fetch
    await fetch("/change-images-post", options).then(function (res) {
        window.location.replace("/my-post");
    }).catch(function (err) {
        ("Error:", err)
    });
}

async function sendDataToaddImage(e) {
    e.preventDefault();
    let parent = e.target.parentNode;
    let dataToSend = {
        p: parent.children[0].innerText
    };
    try {
        let responseObject = await fetch("/change-images-post-data", {
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
            window.location.replace("/my-post")
        }
    } catch (error) {}
}