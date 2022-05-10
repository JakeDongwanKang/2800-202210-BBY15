/**
 * Make the dropdown menu for "Type" visible when users click on "Select type".
*/
const dropdown = document.querySelector(".dropdown");
const select = document.querySelector(".select");
const caret = document.querySelector(".caret");
const menu = document.querySelector(".menu");
const options = document.querySelectorAll(".menu li");
const selected = document.querySelector(".selected");
const question = document.getElementById("weather-type");

// Open the dropdown menu when user selects type of post.
select.addEventListener('click', () => {
    document.querySelector('.form-box.title').style.marginTop = '30%';
    select.classList.toggle('select-clicked');
    caret.classList.toggle('caret-rotate');
    menu.classList.toggle('menu-open');
    question.innerHTML = "";
});

// Close the dropdown menu and display the result after user selects a type of post.
options.forEach(option => {
    option.addEventListener('click', () => {
        document.querySelector('.form-box.title').style.marginTop = '0%';
        selected.innerText = option.innerText;
        select.classList.remove('select-clicked');
        caret.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');
        options.forEach(option => {
            option.classList.remove('active');
        });
        option.classList.add('active');
        
        // Add question asking for what kind of severe weather if user selects to create a post about weather condition.
        if (selected.innerText == "Weather conditions") {
            question.innerHTML = "<label>What kind of severe weather is it?</label>"
                + "<input class='form-input' id='weatherType' placeholder='flood/ drought/ blizzard/...'>";
        }
    });
});

