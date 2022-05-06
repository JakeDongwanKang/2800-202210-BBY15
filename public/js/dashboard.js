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

document.getElementById("manage-users").addEventListener("click", function(e) {
    window.location.replace("/user-list");
})
