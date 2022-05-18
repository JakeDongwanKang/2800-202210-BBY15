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

function changeImg() {
    document.getElementById("ghibli-event").addEventListener("click", function(e) {
        var image = document.getElementById('myImg');
        if(image.src.match("/assets/team_name_drawing.png")) {
            image.src = "/assets/team_ghibli_drawing.png";
        } else {
            image.src = "/assets/team_name_drawing.png";
        }
    }); 
}