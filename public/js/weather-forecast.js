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


 /**
  * Used https://openweathermap.org/
  * And the code's idea was brought from Jonah Lawrence from Youtube.
  */
 let weather = {
     apiKey: "f639c77111fed2e66276e6da631415cc",
     fetchWeather: function(city) {
         fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
         + city 
         + "&appid=" 
         + this.apiKey
         )
         .then((response) => response.json())
         .then((data) => this.displayWeather(data));
     },
     displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temperature").innerText = temp;
        document.querySelector(".humidity").innerText = "Humidity " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed " + speed + "km/h";
 },
 search: function () {
     this.fetchWeather(document.querySelector(".search-bar").value);
 }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});