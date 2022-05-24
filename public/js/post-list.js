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


const dropdown = document.querySelector(".dropdown");
const select = document.querySelector(".select");
const caret = document.querySelector(".caret");
const menu = document.querySelector(".menu");
const options = document.querySelectorAll(".menu li");
const selected = document.querySelector(".selected");
let dropdownButtonClicks = 0;

/**
 * Open the dropdown menu if the number of clicks on dropdown menu is odd.
 * Close the dropdown menu if that number is even (for example, when user wants to select type later).
 */
select.addEventListener('click', () => {
    document.querySelector(".post-container").style.opacity = "1";
    dropdownButtonClicks += 1;
    if (dropdownButtonClicks % 2 != 0) {
        document.querySelector(".post-container").style.opacity = "0.3";
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    } else {
        closeDropdown();
    }

});

/**
 * Close the dropdown menu and display the result after user selects a type of post status.
 * Then, sets the number of clicks on "Select type" dropdown button to 0. 
 */
options.forEach(option => {
    option.addEventListener('click', () => {
        closeDropdown();

        // Display the result after user selects a type of status
        selected.innerText = option.innerText;
        options.forEach(option => {
            option.classList.remove('active');
        });
        option.classList.add('active');

        // Set the display propery of all posts as "grid" before displaying posts with a specific status 
        for (let i = 0; i < postStatus.length; i++) {
            postStatus[i].parentElement.parentElement.parentElement.style.display = "grid";
        }

        //Display posts based on selected post status
        displayPost(option.innerText);

        // Set the number of clicks on dropdown button to 0
        dropdownButtonClicks = 0;
    });
});

/**
 * Close the dropdown menu for types of post.
 */
function closeDropdown() {
    select.classList.remove('select-clicked');
    caret.classList.remove('caret-rotate');
    menu.classList.remove('menu-open');
}


/**
 * Display the posts based on the status that the user selects in Filter.
 */
const postStatus = document.querySelectorAll(".current-status");

function displayPost(selectedStatus) {
    if (selectedStatus == "Approved") {
        // Display all approved posts
        for (let i = 0; i < postStatus.length; i++) {
            if (postStatus[i].innerText != "approved ") {
                postStatus[i].parentElement.parentElement.parentElement.style.display = "none";
            }
        }
    } else if (selectedStatus == "Pending") {
        // Display all pending posts
        for (let i = 0; i < postStatus.length; i++) {
            if (postStatus[i].innerText != "pending ") {
                postStatus[i].parentElement.parentElement.parentElement.style.display = "none";
            }
        }
    } else if (selectedStatus == "Rejected") {
        // Display all rejected/deleted posts
        for (let i = 0; i < postStatus.length; i++) {
            if (postStatus[i].innerText != "rejected ") {
                postStatus[i].parentElement.parentElement.parentElement.style.display = "none";
            }
        }
    } else {
        // Display all posts
        for (let i = 0; i < postStatus.length; i++) {
            postStatus[i].parentElement.parentElement.parentElement.style.display = "grid";
        }
    }
    document.querySelector(".post-container").style.opacity = "1";
}

/**
 * Display the status of posts as different colors: blue for pending posts, red for rejected posts, and green for approved posts.
 */
for (let i = 0; i < postStatus.length; i++) {
    postStatus[i].style.fontWeight = "bold";
    if (postStatus[i].innerText == "pending") {
        postStatus[i].style.color = "#3477F9";
    } else if (postStatus[i].innerText == "approved") {
        postStatus[i].style.color = "#00ca4e";
    } else {
        postStatus[i].style.color = "#ff605c";
    }
}


/**
 * Display "Cancel", "Approve", and "Reject" buttons when users click on status button to either approve or deny posts.
 */
for (let i = 0; i < postStatus.length; i++) {
    postStatus[i].addEventListener("click", function () {
        let children = postStatus[i].parentElement.children;
        children[1].style.display = "none";
        children[2].style.display = "inline-block";
        children[3].style.display = "inline-block";
        children[4].style.display = "inline-block";
    })
}


/**
 * Send data from client side to server for updating post status.
 * @author Arron_Ferguson (1537 instructor), Linh_Nguyen (BBY15)
 * @param {*} data data to send
 */
async function sendData(data, e) {
    try {
        let responseObject = await fetch("/update-status", {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if (parsedJSON.status == "fail") {
            let errorButton = document.createElement("div");
            errorButton.innerHTML = "Unable to change this post status";
            e.parentElement.innerHTML = errorButton;

        } else {
            window.location.replace("/post-list");
        }
    } catch (error) {}
}


/**
 * Display the post status again if users do not want to change the post status.
 * @param {*} e the current html element
 */
function cancel(e) {
    let children = e.parentElement.children;
    children[1].style.display = "";
    children[2].style.display = "none";
    children[3].style.display = "none";
    children[4].style.display = "none";
}


/**
 * Approve users' posts by changing the status and sending data to the server to update new status.
 * @param {*} e 
 */
function approve(e) {
    let postID = e.parentElement.previousElementSibling.innerText;
    let postStatus = "approved";
    sendData({
        postID: postID,
        postStatus: postStatus
    }, e);
}

/**
 * Reject/Delete users' posts by changing the status and sending data to the server to update new status.
 * @param {*} e the current html element
 */
function reject(e) {
    let postID = e.parentElement.previousElementSibling.innerText;
    let postStatus = "rejected";
    sendData({
        postID: postID,
        postStatus: postStatus
    }, e);
}


/**
 * Hide the image div if the specific post has no images.
 */
const allPosts = document.querySelectorAll(".post");
var x = window.matchMedia("(max-width: 800px)");
for (let i = 0; i < allPosts.length; i++) {
    let imgElement = allPosts[i].children[1].children[0]; //Get the img element
    let displayImg = imgElement.style.display; //Get the display property of the img element
    let postBodyElement = allPosts[i].children[0]; //get the post-body element that is in the same card with the img element
    if (displayImg == "none") {
        //Change the display property of the image div (also the parent element of the img element) to "none"
        imgElement.parentElement.style.display = "none";
        if (!x.matches) {
            // Change the grid_column property of the post-body element if users are using web app on desktop/laptop.
            postBodyElement.style.gridColumn = "1 / span 2";
        }

    }
}


/**
 * Display the full post content when users click on "Read more" button.
 * Return to the original setting when users click on "Read less" button. 
 * @param {*} e the current html element
 */
var expandContent = true; // Set a boolean variable to determine if users are expanding or 
function expandText(e) {
    if (expandContent) {
        e.innerHTML = "Read less";
        e.parentElement.style.position = "relative";
        e.parentElement.style.padding = "10px 0";
        e.parentElement.style.backgroundImage = "";
        e.parentElement.parentElement.style.maxHeight = "fit-content";
        expandContent = false;
    } else {
        e.innerHTML = "Read more";
        e.parentElement.style.position = "absolute";
        e.parentElement.style.padding = "30px 0";
        e.parentElement.style.backgroundImage = "linear-gradient(to bottom, transparent, #ffffff)";
        e.parentElement.parentElement.style.maxHeight = "150px";
        expandContent = true;
    }
}


/**
 * Expand the image when users click on that image.
 * @param {*} e the current img element
 */
function expandImage(e) {
    document.querySelector('.popup-image').style.display = "block";
    document.querySelector('.popup-image img').src = e.getAttribute('src');
}

/**
 * Return to the original size when users click on close button (X) or enter escape key. 
 */
document.querySelector('.popup-image span').onclick = () => {
    document.querySelector('.popup-image').style.display = "none";
}

document.body.onkeydown = function (e) {
    if (e.which == 27) {
        document.querySelector('.popup-image').style.display = "none";
    }
}