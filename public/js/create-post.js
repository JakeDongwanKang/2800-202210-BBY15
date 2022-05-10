const dropdown = document.querySelector(".dropdown");
const select = document.querySelector(".select");
const caret = document.querySelector(".caret");
const menu = document.querySelector(".menu");
const options = document.querySelectorAll(".menu li");
const selected = document.querySelector(".selected");
const question = document.getElementById("weather-type");
let dropdownButtonClicks = 0;

/**
 * Open the dropdown menu if the number of clicks on dropdown menu is odd.
 * Close the dropdown menu if that number is even (for example, when user wants to select type later).
*/ 
select.addEventListener('click', () => {
    dropdownButtonClicks += 1;
    if (dropdownButtonClicks % 2 != 0) {
        // Make space for dropdown menu in 2 different viewport according to media queries.
        var x = window.matchMedia("(max-width: 800px)");
        if (x.matches) {
            document.querySelector('.form-box.title').style.marginTop = '75%';
        } else {
            document.querySelector('.form-box.title').style.marginTop = '35%';
        }
        
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
        question.innerHTML = "";
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

        // Add question asking for what kind of severe weather if user selects to create a post about weather condition.
        if (selected.innerText == "Weather conditions") {
            question.innerHTML = "<label>What kind of severe weather is it?</label>"
                + "<input class='form-input' id='weatherType' placeholder='flood/ drought/ blizzard/...'>";
        }

        // Set the number of clicks on dropdown button to 0
        dropdownButtonClicks = 0;
    });
});

/**
 * Close the dropdown menu for types of post.
 */
function closeDropdown() {
    document.querySelector('.form-box.title').style.marginTop = '0%';
    select.classList.remove('select-clicked');
    caret.classList.remove('caret-rotate');
    menu.classList.remove('menu-open');
}