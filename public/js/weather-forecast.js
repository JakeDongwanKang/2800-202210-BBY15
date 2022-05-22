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
     apiKey: "409920448d71baef986e2cb0a350df62",
     fetchWeather: function(city) {
         fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
         + city 
         + "&units=metric"
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
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temperature").innerText = temp + "°c";
        document.querySelector(".humidity").innerText = "Humidity " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed " + speed + "km/h";
 },
 search: function () {
     this.fetchWeather(document.querySelector(".search-bar").value);
 }
};

document.getElementById("search-button").addEventListener("click", function () {
    weather.search();
});

/**
 * The following codes follow an example on W3Schools (https://www.w3schools.com/html/html5_geolocation.asp)
 * and Geeks for Geeks (https://www.geeksforgeeks.org/how-to-get-city-name-by-using-geolocation/)
 * with changes and adjustments made by Vincent.
 */
 function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  var coordinates = [position.coords.latitude, position.coords.longitude];
  getCity(coordinates);
}

function getCity(coordinates) {
  var xhr = new XMLHttpRequest();
  var lat = coordinates[0];
  var lng = coordinates[1];

  // Paste your LocationIQ token below.
  xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.d0436933238c32ce026236ff72afc4d0&lat=" +
  lat + "&lon=" + lng + "&format=json", true);
  xhr.send();
  xhr.onreadystatechange = processRequest;

  function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          document.querySelector(".search-bar").value = response.address.city;
          weather.search();
          return;
      }
  }
}