var APIKey = '92dcd99075e42747c6a9b09497364593';
var city;
var date = moment().format('M/DD/YYYY');
var storedArray = [];
var buttonList = $('#buttonlist');
var forecastCardDiv = $('#forecast')

// Retrieve local storage and load on page load
function getLocalStorage() {
    var downloadedPlaces = JSON.parse(localStorage.getItem("places"));
    if (downloadedPlaces !== null) {
        storedArray = downloadedPlaces;
        for (let i = storedArray.length-1; i >= 0; i--) {
            let currentEl = storedArray[i];
            var button = $('<button>');
            button.addClass("col-12 mb-3 border-0 rounded p-1");
            button.css('background', '#ADAEAE');
            button.attr('id', currentEl);
            button.text(currentEl);
            buttonList.append(button);
        }
    }
}
getLocalStorage();

// Load Seattle weather on page load
function pageLoad () {
    city = 'Seattle';
    var pageLoadURL = "https://api.openweathermap.org/data/2.5/weather?q=Seattle&units=imperial&appid=92dcd99075e42747c6a9b09497364593";
        fetch(pageLoadURL)
            .then(function (response) {
                if (!response.ok) {
                alert('Please enter a valid city.');
                throw response.json();
                } 
            return response.json();
            })

            .then(function(data) {
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;

                function fetchForecast() {

                    var forecastRequest = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;
                
                    fetch(forecastRequest)
                        .then(function (response) {
                            if (!response.ok) {
                            throw response.json();
                            } 
                        return response.json();
                        })
                        .then(function(data) {
                            // Today's weather
                            var currentTemp = data.current.temp + "\xB0 F";
                            var currentWind = data.current.wind_speed + " MPH";
                            var currentHumidity = data.current.humidity + "%";
                            var currentUVI = data.current.uvi;
                            var iconCode = data.current.weather[0].icon;

                            var iconURL = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
                            
                            var icon = $(`<img id="icon" alt="weather icon">`);
                            icon.attr('src', iconURL);
                            var spanIcon = $('<span>');
                            spanIcon.append(icon);

                            postCurrentWeather(city, currentTemp, currentWind, currentHumidity, currentUVI, iconCode);

                            // 5-day forecast
                            var dailyForecast = data.daily;
                            forecastCardDiv.empty();
                            for (let i = 1; i < 6; i++) {
                                let currentDay = dailyForecast[i];
                                var unix = currentDay.dt;
                                var forecastedDate = moment.unix(unix).format('M/DD/YYYY');
                                var forecastedTemp = currentDay.temp.day  + "\xB0 F";
                                var forecastedWind = currentDay.wind_speed + " MPH";
                                var forecastedHumidity = currentDay.humidity + " %";
                                var forecastedIcon = currentDay.weather[0].icon;

                                var forecastIconURL = 'https://openweathermap.org/img/wn/' + forecastedIcon + '@2x.png';

                                var iconEl = $(`<img id="icon" alt="weather icon">`);
                                iconEl.attr('src', forecastIconURL);

                                createForecastCard(forecastedDate, forecastedTemp, forecastedWind, forecastedHumidity, iconEl)
                            }
                        })
                }
                fetchForecast();
            })
}
pageLoad();
