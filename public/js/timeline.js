"use strict";
//Hambuger menu
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

const facebookBtn = document.querySelector(".facebook-btn");
const twitterBtn = document.querySelector(".twitter-btn");
const pinterestBtn = document.querySelector(".pinterest-btn");
const linkedinBtn = document.querySelector(".linkedin-btn");
const whatsappBtn = document.querySelector(".whatsapp-btn");

document.getElementById("search-button").addEventListener("click", function(e) {
    sendData({searchTerm: document.getElementById("allevents-search-keyword").value});
})

async function sendData(data) {
    try {
        let responseObject = await fetch("/search-timeline", {
            method: 'POST',
            headers: { "Accept": 'application/json',
                       "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await responseObject.json();
        if(parsedJSON.status == "success") {
            document.querySelector('.post_content').innerHTML = parsedJSON.message;
        }
    } catch(error) {}
}