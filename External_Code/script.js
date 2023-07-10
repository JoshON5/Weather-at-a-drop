var key = "6a6cbc32f4561808ace2b90501c16235";
var city;
var pastCity;
// var errorMssg = (response) => {
//     if (!response.ok) {
//         throw Error(response.statusText)
//     }
//     return response;
// })
// var lat = "33.75"
// var lon = "-84.39"

// var api = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=6a6cbc32f4561808ace2b90501c16235&units=imperial";

// fetch(api)
// .then (function(response){
//     return response.json();
// })
// .then (function (data) {
//     console.log(data)
// })
var userValueEl = document.querySelector('#search-input');
var searchButtonEl = document.querySelector('#search-btn');
var currentCityEl = document.querySelector('#city');
var displayCityEl = document.querySelector('#city-value');
var weatherContainerEl = document.querySelector('#five-day-container');
var userHistoryEl = document.querySelector('#searched-cities');
var forecastCardsEl = document.querySelector('#forecast-cards');

var userHistory = [];




function getCoordinates(city) {
    var api = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + key
    console.log(api)
    fetch(api)
    .then (function (response) {
        return response.json();
    })
    .then (function (data){
        console.log(data.coord)
    })

}

function formSubmitHandler (event) {
    event.preventDefault();
    var search = currentCityEl.value.trim();
    getCoordinates(search)
};

userValueEl.addEventListener("submit", formSubmitHandler)