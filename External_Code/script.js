var key = "6a6cbc32f4561808ace2b90501c16235";

var userValueEl = document.querySelector("#search-input");
var searchButtonEl = document.querySelector("#search-btn");
var currentCityEl = document.querySelector("#city");
var displayCityEl = document.querySelector("#city-value");
var displayDateEl = document.querySelector("#date");
var weatherContainerEl = document.querySelector("#five-day-container");
var fiveDayEl = document.querySelector(".fiveDayContainer");
var pastCitiesEl = document.querySelector("#searched-cities");
var userHistoryEl = document.querySelector("#past-cities");
var forecastCardsEl = document.querySelector("#forecast-cards");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvEl = document.querySelector("#uv-index");
// empty array to use for user history value to be inputted
var userHistory = [];
// function to fetch the API for the city name searched and get the data for the longitude and latitude.
function getCoordinates(city) {
	var api =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&units=imperial&appid=" +
		key;
	console.log(api);
	fetch(api)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data.coord);
			getWeather(data.coord.lat, data.coord.lon);
		});
}
// calling the getweather function that holds the path to the longitude and longitude to then input to the API for displaying the data we want.
var getWeather = function (lat, lon) {
	var url =
		"https://api.openweathermap.org/data/2.5/forecast?lat=" +
		lat +
		"&lon=" +
		lon +
		"&appid=6a6cbc32f4561808ace2b90501c16235&units=imperial";
	fetch(url).then(function (response) {
		if (response.ok) {
			response.json().then(function (data) {
				console.log(data)
				// creating variables that gets the info corresponding to that specific info to hold.
				var cityName = data.city.name;
				var tempVal = data.list[0].main.temp;
				var windVal = data.list[0].wind.speed;
				var humidityVal = data.list[0].main.humidity;
				var icondId = data.list[0].weather[0].icon;
				var epochDate = data.list[0].dt;
				// used to convert the Unix time and format it to display only the ("MM-DD-YYYY") format.
				var dateRaw = new Date(epochDate * 1000 - 14400000);
				console.log(dateRaw)
				var formattedDate =
					dateRaw.getUTCMonth() +
					1 +
					"-" +
					dateRaw.getUTCDate() +
					"-" +
					dateRaw.getUTCFullYear();

				displayCityEl.innerHTML = cityName + " (" + formattedDate + ") ";
				// creating a variable that holds where the icon will be displayed in the HTML and writing how it will be dynamically inputted in.
				var weatherImg = document.querySelector(".weather-icon");
				weatherImg.innerHTML =
					"<img" +
					" src=" +
					"http://openweathermap.org/img/wn/" +
					icondId +
					"@2x.png>";
				// Rounding out the temperature for a cleaner look.
				var tempRound = Math.round(tempVal);

				tempEl.innerHTML = tempRound + " \xB0" + "F";
				windEl.innerHTML = windVal + " mph";
				humidityEl.innerHTML = humidityVal + " %";

				displayForecast(data);
			});
		}

		function displayForecast(data) {
			console.log(data.list[7].wind.speed);
			forecastCardsEl.innerHTML = "";
			// creating a for loop that goes through every 8 in the list since it's formatted by every 3 hours to have a forecast in the API.
			for (var i = 1; i < data.list.length; i += 8) {
				// creating elements that will be dynamically inserted into the HTML for each card a seperate day.
				var forecastCard = document.createElement("div");
				forecastCard.setAttribute(
					"class",
					"column mx-1 card has-background-info-dark"
				);
				var forecastCardTitle = document.createElement("p");
				forecastCardTitle.setAttribute("class", "title has-text-white");
				var forecastDate = document.createElement("p");
				forecastDate.setAttribute("class", "has-text-white");
				var forecastIcon = document.createElement("img");
				var forecastTemp = document.createElement("p");
				forecastTemp.setAttribute("class", "has-text-white");
				var forecastWind = document.createElement("p");
				forecastWind.setAttribute("class", "has-text-white");
				var forecastHumidity = document.createElement("p");
				forecastHumidity.setAttribute("class", "has-text-white");

				var date = data.list[i].dt;
				var dateRaw = new Date(date * 1000);
				var forecastDateEl =
					dateRaw.getUTCMonth() +
					1 +
					"-" +
					dateRaw.getUTCDate() +
					"-" +
					dateRaw.getUTCFullYear();

				var forecastIconUrl = data.list[i].weather[0].icon;

				var temp = data.list[i].main.temp;
				var tempRound = Math.round(temp);

				forecastCardTitle.innerHTML = data.city.name;
				forecastDate.textContent = forecastDateEl;
				forecastIcon.setAttribute(
					"src",
					"http://openweathermap.org/img/wn/" + forecastIconUrl + "@2x.png"
				);
				forecastTemp.textContent = "Temp: " + tempRound + " \xB0" + "F";
				forecastWind.textContent = "Wind: " + data.list[i].wind.speed + " mph";
				forecastHumidity.textContent =
					"Humidity: " + data.list[i].main.humidity + " %";

				forecastCard.append(
					forecastCardTitle,
					forecastDate,
					forecastIcon,
					forecastTemp,
					forecastWind,
					forecastHumidity
				);
				forecastCardsEl.append(forecastCard);
			}
		}
	});
};

// creating a function that will create the search values as buttons and appending them to the previous cities element in the HTML.
function displayHistory() {
	userHistoryEl.innerHTML = "";
	for (var i = 0; i <= userHistory.length - 1; i++) {
		var searchButtonEl = document.createElement("button");
		searchButtonEl.setAttribute("type", "button");
		searchButtonEl.classList = "button is-info is-fullwidth";
		searchButtonEl.setAttribute("data-search", userHistory[i]);
		searchButtonEl.textContent = userHistory[i];
		userHistoryEl.append(searchButtonEl);
	}
}
// setting the local storage.
function setHistory(cityInfo) {
	if (!userHistory.includes(currentCityEl.value)) {
		userHistory.push(cityInfo);
		localStorage.setItem("id", JSON.stringify(userHistory));
	}
	displayHistory();
}
// getting the local storage and running the display history function.
function getHistory() {
	var storageHistory = localStorage.getItem("id");
	if (storageHistory) {
		userHistory = JSON.parse(storageHistory);
	}
	displayHistory();
}
// creating a click event for the search button that begins to run the functions for getting the weather and creating the previous cities element and also displaying the hidden elements.
function formSubmitHandler(event) {
	event.preventDefault();
	var search = currentCityEl.value.trim();
	getCoordinates(search);
	setHistory(search);
	fiveDayEl.setAttribute("style", "display: block");
	pastCitiesEl.setAttribute("style", "display: block");
}
// button event for the previous searched cities element.
function historyHandler(event) {
	if (!event.target.matches("button")) {
		return;
	}
	var buttonClick = event.target;
	var search = buttonClick.getAttribute("data-search");
	getCoordinates(search);
}

getHistory();

userHistoryEl.addEventListener("click", historyHandler);
userValueEl.addEventListener("submit", formSubmitHandler);
