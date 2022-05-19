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

// Search text input
$('#search').on("click", function (event) {
    event.preventDefault();
    city = $('#searchbox').val().trim();
    city=city.charAt(0).toUpperCase() + city.slice(1);
    function fetchLatLon() {
        var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=92dcd99075e42747c6a9b09497364593";
    
        fetch(requestURL)
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

                            postCurrentWeather(city, currentTemp, currentWind, currentHumidity, currentUVI, iconCode)

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

                                createForecastCard(forecastedDate, forecastedTemp, forecastedWind, forecastedHumidity, iconEl);
                            }
                            // Save to local storage
                            function setLocalStorage() {
                                var storedPlaces = JSON.parse(localStorage.getItem("places"));
                                if (storedPlaces !== null) {
                                    storedArray = storedPlaces;
                                }
                                storedArray.push(city);
                                localStorage.setItem("places", JSON.stringify(storedArray));
                            }
                            setLocalStorage();
                            
                            // New button for city
                            var button = $('<button>');
                            button.addClass("col-12 mb-3 border-0 rounded p-1");
                            button.css('background', '#ADAEAE');
                            button.attr('id', city);
                            button.text(city);
                            buttonList.prepend(button);
                        })
                }
                fetchForecast();
            })
    }
    fetchLatLon();
    $('#searchbox').val('');    
})

// City button click event
buttonList.on("click", function (event) {
    var buttonID = event.target.id;
    city = buttonID; 
    function fetchLatLon() {
        var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=92dcd99075e42747c6a9b09497364593";
    
        fetch(requestURL)
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
    fetchLatLon()
})    

function postCurrentWeather(city, temp, wind, humidity, uvi, code) {
    var iconURL = 'https://openweathermap.org/img/wn/' + code + '@2x.png';                       
    var icon = $(`<img id="icon" alt="weather icon">`);
    icon.attr('src', iconURL);
    var spanIcon = $('<span>');
    spanIcon.append(icon);
    var todaysWeather = $('#weatherToday')
    todaysWeather.children().eq(0).text(city + ' ' + date + ' ');
    todaysWeather.children().eq(0).css('font-weight', 'bold');
    todaysWeather.children().eq(1).text('Temp: ' + temp);
    todaysWeather.children().eq(2).text('Wind: ' + wind);
    todaysWeather.children().eq(3).text('Humidity: ' + humidity);

    var UVbox = $('<span>');
    if (uvi < 3) {
        UVbox.css("background", "green");
    } else if (3 <= uvi < 8) {
        UVbox.css("background", "yellow");
        UVbox.css("color", "black");
    } else {
        UVbox.css("background", "red");
        UVbox.css("color", "black");
    }
    UVbox.css("color", "white");
    UVbox.addClass("p-1");
    UVbox.text(uvi);
    todaysWeather.children().eq(4).text('UV Index: ');
    todaysWeather.children().eq(4).append(UVbox);
    todaysWeather.children().eq(0).append(spanIcon);
}

function createForecastCard (date, temp, wind, humidity, icon) {
    var forecastCard = $('<div>');
    forecastCard.addClass("card col-md-2 text-white p-3");
    forecastCard.css('background-image', 'linear-gradient(to right, #2959c1, #261F6C)');
    var forecastDate = $('<h5>');
    forecastDate.text(date);
    forecastDate.css('font-weight', 'bold');
    var forecastTemp = $('<p>');
    forecastTemp.text('Temp: ' + temp);
    var forecastWind = $('<p>');
    forecastWind.text('Wind: ' + wind);
    var forecastHumidity = $('<p>');
    forecastHumidity.text('Humidity: ' + humidity);
    forecastCard.append(forecastDate);
    forecastCard.append(icon)
    forecastCard.append(forecastTemp);
    forecastCard.append(forecastWind);
    forecastCard.append(forecastHumidity);
    forecastCardDiv.append(forecastCard);
}