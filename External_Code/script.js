var key = "6a6cbc32f4561808ace2b90501c16235";
// var errorMssg = (response) => {
//     if (!response.ok) {
//         throw Error(response.statusText)
//     }
//     return response;
// })
var userValueEl = document.querySelector("#search-input");
var searchButtonEl = document.querySelector("#search-btn");
var currentCityEl = document.querySelector("#city");
var displayCityEl = document.querySelector("#city-value");
var displayDateEl = document.querySelector("#date");
var weatherContainerEl = document.querySelector("#five-day-container");
var userHistoryEl = document.querySelector("#searched-cities");
var forecastCardsEl = document.querySelector("#forecast-cards");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvEl = document.querySelector("#uv-index");

var userHistory = [];

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
				console.log(data);
				// displayWeather(data.list[0])
				var cityName = data.city.name;
				var tempVal = data.list[0].main.temp;
				var windVal = data.list[0].wind.speed;
				var humidityVal = data.list[0].main.humidity;
				var icondId = data.list[0].weather[0].icon;
				var epochDate = data.list[0].dt;

				var dateRaw = new Date(epochDate * 1000);
				var formattedDate =
					dateRaw.getUTCMonth() +
					1 +
					"-" +
					dateRaw.getUTCDate() +
					"-" +
					dateRaw.getUTCFullYear();

				displayCityEl.innerHTML = cityName + " (" + formattedDate + ") ";

				var weatherImg = document.querySelector(".weather-icon");
				weatherImg.innerHTML =
					"<img" +
					" src=" +
					"http://openweathermap.org/img/wn/" +
					icondId +
					"@2x.png>";

				var tempRound = Math.round(tempVal);

				tempEl.innerHTML = tempRound + " \xB0" + "F";
				windEl.innerHTML = windVal + " mph";
				humidityEl.innerHTML = humidityVal + " %";

				displayForecast(data);
			});
		}

		function displayForecast(data) {
			console.log(data.list[7].wind.speed)
			forecastCardsEl.innerHTML = "";

			for (var i = 1; i < data.list.length; i+=8) {
				var forecastCard = document.createElement("div")
				forecastCard.setAttribute("class", "column mx-1 card has-background-info-dark")
				var forecastCardTitle = document.createElement('p')
				forecastCardTitle.setAttribute("class", "title has-text-white")
				var forecastDate = document.createElement('p')
				forecastDate.setAttribute("class", "has-text-white")
				var forecastIcon = document.createElement('img')
				var forecastTemp = document.createElement('p')
				forecastTemp.setAttribute("class", "has-text-white")
				var forecastWind = document.createElement('p')
				forecastWind.setAttribute("class", "has-text-white")
				var forecastHumidity = document.createElement('p')
				forecastHumidity.setAttribute("class", "has-text-white")

				var date = data.list[i].dt
				var dateRaw = new Date(date * 1000)
				var forecastDateEl = dateRaw.getUTCMonth() +
				1 +
				"-" +
				dateRaw.getUTCDate() +
				"-" +
				dateRaw.getUTCFullYear()

				var forecastIconUrl = data.list[i].weather[0].icon

				var temp = data.list[i].main.temp;
				var tempRound = Math.round(temp)

				forecastCardTitle.innerHTML = data.city.name;
				forecastDate.textContent = forecastDateEl;
				forecastIcon.setAttribute("src", "http://openweathermap.org/img/wn/"+forecastIconUrl+"@2x.png");
				forecastTemp.textContent = "Temp: " + tempRound + " \xB0" + "F";
				forecastWind.textContent = "Wind: " + data.list[i].wind.speed + " mph";
				forecastHumidity.textContent = "Humidity: " + data.list[i].main.humidity + " %";

				forecastCard.append(forecastCardTitle, forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity)
				forecastCardsEl.append(forecastCard);
			}



		}

		// for (var i = 0; i < data.list[]; i++) {
		//     console.log(main)
		//     var temp = main[i].temp + "°F";
		//     var humidity = main[i].humidity;
		//     tempEl.innerHTML = temp;
		//     humidityEl.innerHTML = humidity;
		// }
	});

	// var displayWeather = function(weather, main) {

	//     // for (var i = 0; i < main.length; i++) {
	//     //     console.log(main)
	//     //     var temp = main[i].temp + "°F";
	//     //     var humidity = main[i].humidity;
	//     //     tempEl.innerHTML = temp;
	//     //     humidityEl.innerHTML = humidity;
	//     // }
	// }
};

function setSearchHistory() {

	var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
	console.log(currentCityEl.value);
	console.log(searchHistory);
	if (!searchHistory.includes(currentCityEl.value)) {
		searchHistory.push(currentCityEl.value)
		localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

	}
	
	
}

function formSubmitHandler(event) {
	event.preventDefault();
	var search = currentCityEl.value.trim();
	getCoordinates(search);
	setSearchHistory();
}

userValueEl.addEventListener("submit", formSubmitHandler);
