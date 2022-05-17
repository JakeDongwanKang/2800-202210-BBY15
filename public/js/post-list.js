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
        // Make space for dropdown menu in 2 different viewport according to media queries.
        // var x = window.matchMedia("(max-width: 800px)");
        // if (x.matches) {
        //     document.querySelector('.post-container').style.marginTop = '180px';
        // } else {
        //     document.querySelector('.post-container').style.marginTop = '170px';
        // }

        document.querySelector(".post-container").style.opacity = "0.3";
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    } else {
        closeDropdown();
    }

});

/**
 * Close the dropdown menu and display the result after user selects a type of post.
 * Then, sets the number of clicks on "Select type" dropdown button to 0. 
 */
options.forEach(option => {
    option.addEventListener('click', () => {
        closeDropdown();

        // Display the result after user selects a type
        selected.innerText = option.innerText;
        options.forEach(option => {
            option.classList.remove('active');
        });
        option.classList.add('active');
        let selectedStatus = selected.innerText;
        displayPost(selectedStatus);

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
const postStatus = document.querySelectorAll(".post-status");

function displayPost(selectedStatus) {
    if (selectedStatus == "Approved") {
        for (let i = 0; i < postStatus.length; i++) {
            if (postStatus[i].innerText != "Status: approved") {
                postStatus[i].parentElement.parentElement.style.display = "none";
            }
        }
    }
    if (selectedStatus == "Pending") {
        for (let i = 0; i < postStatus.length; i++) {
            if (postStatus[i].innerText != "Status: pending") {
                postStatus[i].parentElement.parentElement.style.display = "none";
            }
        }
    }
    if (selectedStatus == "Rejected") {
        for (let i = 0; i < postStatus.length; i++) {
            if (postStatus[i].innerText != "Status: rejected") {
                postStatus[i].parentElement.parentElement.style.display = "none";
            }
        }
    }

    if (selectedStatus == "All") {
        for (let i = 0; i < postStatus.length; i++) {
            postStatus[i].parentElement.parentElement.style.display = "grid";
        }
    }
    document.querySelector(".post-container").style.opacity = "1";
}